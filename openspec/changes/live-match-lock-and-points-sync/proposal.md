## Why
O sistema atual apresenta dois problemas urgentes reportados:
1. Jogos que já iniciaram (como o de Portugal) continuam permitindo edição do palpite porque a validação de bloqueio no frontend confia apenas no status `'SCHEDULED'` vindo do banco, que nem sempre é atualizado em tempo real.
2. A pontuação atual exibida no aplicativo difere do documento oficial (`Palpites da Copa1.pdf`), causando divergência de 1 a 14 pontos dependendo do usuário devido à assincronia na importação de jogos passados e seus devidos cálculos de pontos.

## What Changes
1. **Bloqueio Automático por Data (Frontend):** 
Em `App.tsx`, no momento de formatar os jogos recebidos do banco, o sistema irá comparar a `data_hora` do jogo com a data e hora atual do dispositivo do usuário (`new Date()`). Se o jogo já deveria ter começado (data no passado) e o status do banco ainda constar como `'SCHEDULED'`, o frontend forçará a mudança do status computado para `'LIVE'`, travando a interface imediatamente.

2. **Correção de Pontuação via Legado (Backend):** 
Para que o ranking corresponda *exatamente* à planilha oficial consolidada, rodaremos um script/update no banco de dados ajustando a coluna `pontos_legado` da tabela `usuarios`. O novo `pontos_legado` será a diferença exata entre a pontuação total alvo (do PDF) e a soma de pontos já calculada no aplicativo, zerando qualquer inconsistência.

As pontuações alvo extraídas do PDF são:
- **Gabriel:** 106
- **Thyago:** 104
- **Enos:** 94
- **Paulo:** 92
- **Jairo:** 90

## Capabilities
### Modified Capabilities
- **Cálculo Dinâmico de Match (`app`)**: O status do jogo agora responde ativamente ao relógio do navegador.
- **Tabela de Usuários (`pontos_legado`)**: Ajuste pontual e definitivo para alinhar com o documento oficial do bolão.

## Impact
- **Segurança da Aposta:** Fim da janela de fraude ("apostar com o jogo rolando").
- **Confiabilidade:** Jogadores verão no app a mesma pontuação divulgada no PDF corporativo.
