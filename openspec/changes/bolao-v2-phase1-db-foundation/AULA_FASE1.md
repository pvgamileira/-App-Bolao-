# Sala de Aula Avançada: Fase 1 (PostgreSQL & Supabase Architecture) 🏗️

Fala, mano! Já que você domina o SQL do nível intermediário pro avançado, vamos elevar o nível da nossa conversa. Esquece aquela analogia básica de Arrays e vamos mergulhar na verdadeira engenharia de banco de dados do Supabase (que roda PostgreSQL por baixo dos panos).

Nesta Fase 1, nós implementamos as fundações do Multi-tenant (SaaS). Aqui está o destrinchamento das decisões arquiteturais tomadas no script `20260625000000_bolao_v2_fase1.sql`.

---

## 1. DDL: Integridade Referencial e Cascatas

Ao criar a tabela associativa `membros_liga`, nós aplicamos duas constraints cruciais para a saúde de um SaaS:

```sql
liga_id UUID REFERENCES public.ligas(id) ON DELETE CASCADE NOT NULL,
UNIQUE(usuario_id, liga_id)
```

**Por que foi feito assim?**
- **`ON DELETE CASCADE`**: Diferente da referência ao `usuario_id`, a referência à liga tem um CASCADE. Isso significa que se um dia o ADM deletar a liga do banco, o PostgreSQL se encarrega de deletar automaticamente todas as linhas na `membros_liga` associadas a ela. Isso evita "Orphaned Records" (registros fantasmas apontando para IDs que não existem mais) e limpa o banco automaticamente sem precisarmos de rotinas de limpeza.
- **Índice Composto (`UNIQUE`)**: Ao invés de checar no código se o usuário já está na liga antes de fazer o INSERT (o que gera risco de "Race Condition"), nós delegamos a trava pro banco. Se a API tentar inserir o mesmo usuário 2x na mesma liga no mesmo milissegundo, o banco dá um erro de violação de *Constraint* e protege a integridade.

---

## 2. Deep Dive em RLS (Row Level Security)

Se você já fez APIs backend (Node, PHP, etc.), você sabe que normalmente a segurança é feita no código (middleware). O Supabase inverte isso: a segurança fica direto no "banco", rodando a nível de Engine do Postgres.

O RLS funciona essencialmente anexando uma cláusula `WHERE` implícita em toda query que chega.

Veja a nossa política mais complexa:
```sql
CREATE POLICY "Isolamento de Membros da Liga" 
ON public.membros_liga FOR SELECT 
TO authenticated 
USING (
    usuario_id = auth.uid() 
    OR 
    liga_id IN (
        SELECT liga_id FROM public.membros_liga WHERE usuario_id = auth.uid()
    )
);
```
**O que acontece por trás dos panos:**
Quando o Frontend faz `supabase.from('membros_liga').select('*')`, o Planner do PostgreSQL transforma a query em:
`SELECT * FROM membros_liga WHERE <A REGRA DO USING ACIMA>`.

A lógica faz um "Self-Join" implícito (através da Subquery). O banco verifica:
1. Essa linha é minha? (`usuario_id = auth.uid()`)
2. Ou o ID da liga desta linha está presente em uma lista (Array retornado pela subquery) de todas as ligas onde eu sou membro?

Se a resposta for não, a linha é omitida. Isso garante Isolamento de Tenants absoluto, onde a Liga "Firma" e a Liga "Família" nunca vazam dados entre si na mesma tabela.

---

## 3. PL/pgSQL e a Migração "Zero Downtime"

Para migrar os usuários atuais para a nova estrutura sem derrubar o app, não podíamos usar queries separadas (que geram risco de corromper o banco se a internet cair no meio). Nós usamos um **Bloco Anônimo** (`DO $$ ... END $$;`), que é nativo do PostgreSQL (PL/pgSQL).

Um bloco anônimo executa tudo dentro de uma única **Transação** no servidor. Ou tudo passa, ou tudo falha (*Rollback* total).

```sql
DO $$
DECLARE
    admin_id UUID;
    nova_liga_id UUID;
BEGIN
    -- Busca
    SELECT id INTO admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
    
    -- Inserção com RETURNING
    INSERT INTO public.ligas (nome, codigo_convite, criador_id)
    VALUES ('Bolão Oficial', 'BOLAO_OFICIAL', admin_id)
    RETURNING id INTO nova_liga_id;

    -- Inserção Massiva (Bulk Insert) via Select
    INSERT INTO public.membros_liga (usuario_id, liga_id, saldo_pontos)
    SELECT u.id, nova_liga_id, COALESCE(u.pontos_legado, 0)
    FROM public.usuarios u;
END $$;
```

**Conceitos Avançados Utilizados:**
1. **`SELECT INTO`**: Salva o resultado de uma busca diretamente em uma variável na memória do Postgres sem retornar dados para a rede.
2. **`RETURNING id INTO`**: Evita a famosa gambiarra de "Inserir e depois buscar o ID do último inserido". No exato momento do INSERT, o Postgres captura o UUID gerado e salva na nossa variável `nova_liga_id`.
3. **Bulk Insert Otimizado (`INSERT INTO ... SELECT`)**: Ao invés de fazer um loop forEach() na API chamando vários inserts (o que seria hiper lento e custoso no plano gratuito), nós instruímos o Postgres a pegar o resultado inteiro de um `SELECT` e jogar diretamente dentro de um `INSERT` em uma única operação de I/O em disco. É instantâneo.

Ao rodar isso, nós populamos as tabelas Multi-tenant. Quando na Fase 2 nós ligarmos as views no frontend, a transição para o usuário final será completamente invisível.
