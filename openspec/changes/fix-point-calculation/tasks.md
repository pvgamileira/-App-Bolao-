## 1. Atualizar Função e Trigger de Pontuação

- [x] 1.1 Em `automation_triggers.sql`, modificar a declaração de `trigger_update_points` removendo o `WHEN`.
- [x] 1.2 Em `automation_triggers.sql`, alterar o tipo do trigger de `AFTER UPDATE` para `AFTER INSERT OR UPDATE`.
- [x] 1.3 Em `automation_triggers.sql`, refatorar a linha do `IF NEW.status = 'FINISHED'...` dentro da função para verificar `TG_OP` ('INSERT' ou 'UPDATE') e usar essa lógica para validar o disparo.

## 2. Aplicar as Mudanças e Recalcular

- [x] 2.1 Criar um arquivo SQL em `supabase/migrations/` com as atualizações da trigger para persistir o estado do banco de dados (e opcionalmente script de rodar direto).
- [x] 2.2 Recomendar ao usuário o comando ou script necessário para fazer o deploy ou rodar essa atualização no SQL Editor do Supabase para que tudo volte ao normal.
