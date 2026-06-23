# Diário de Bordo - Bolão da Firma

Este documento registra todas as ideias, melhorias contínuas, atualizações e correções que planejamos implementar no aplicativo. Serve como um repositório de contexto para facilitar a criação de futuras propostas (Proposals) e planos de implementação (OpenSpec).

---

## 📌 Backlog de Melhorias e Atualizações

### 1. [CONCLUÍDO] Sistema de "Primeiro Acesso" (Recuperação de Usuários da Planilha)
**Contexto:** Atualmente, os 5 usuários importados da planilha de histórico possuem `pin = null` (ou vazio) no banco de dados, permitindo que acessem o sistema sem uma senha real (ou gerando furos de segurança).
**O que precisa ser feito:**
- Bloquear o login direto desses usuários se a senha no banco estiver vazia ou nula.
- Redirecioná-los para um fluxo de "Criar Conta" ou "Primeiro Acesso".
- Fazer com que o sistema exija a criação de um PIN e atualize o registro já existente na tabela `usuarios`, preservando os pontos e histórico.
- Somente após essa configuração da senha, liberar o acesso ao Dashboard.

### 2. Versionamento Visível (App Version)
**Contexto:** Facilitar o acompanhamento de quais novidades já estão em produção para os usuários finais.
**O que precisa ser feito:**
- Adicionar uma tag de versão (ex: `v1.0.1`) visível na tela inicial de login/cadastro e possivelmente no rodapé do aplicativo.
- Estabelecer uma lógica simples de incremento (ex: arquivo `.env` ou hardcoded no `Layout.tsx`).

### 3. Integração de API de Placar em Tempo Real
**Contexto:** Tornar a experiência de acompanhamento mais rica e dinâmica durante os jogos ao vivo, sem precisar que o usuário saia do app para conferir como o jogo está.
**O que precisa ser feito:**
- Buscar pela edge function da API da ESPN os placares e status dos jogos.
- Exibir dinamicamente o tempo de jogo (minutos decorridos) e o placar oficial atualizado em tempo real.
- Mostrar esses dados ao lado ou embaixo do modal de palpites do respectivo jogo na interface do usuário.

### 4. Sistema de Múltiplos Bolões e Convites (Multitenancy)
**Contexto:** O objetivo é distribuir o aplicativo para outras pessoas e grupos poderem usar de forma isolada. Atualmente, todos os usuários e jogos compartilham um único ranking global.
**O que precisa ser feito:**
- **Nova Entidade `Bolão` (ou Grupo):** Criar uma tabela no Supabase para representar um "Bolão", contendo um código de convite único.
- **Relação N:N (Usuários <-> Bolões):** 1 usuário pode participar de N bolões. Os líderes de bolão podem gerenciar quem participa.
- **Isolamento de Leaderboards:** O ranking (LeaderboardPodium) passará a ser filtrado pelo "Bolão" que o usuário selecionou, mostrando apenas as pessoas daquele grupo.
- **Isolamento de Palpites:** Definir a regra de negócio: Se o usuário está em 2 bolões e faz um palpite no jogo do Brasil, esse palpite vale pros 2 bolões ou cada bolão tem seu próprio palpite? (A definir no plano de implementação).
- **Interface de Grupos:** Criar uma tela para o usuário criar seu próprio bolão ou entrar em um bolão através de um código de acesso.

---

*Nota: Apenas a primeira etapa "Fix First Access" e a correção de "Live Match Lock and Points Sync" foram implementadas. Ao solicitar a implementação de qualquer um desses pontos, utilize `/opsx-propose` mencionando o item desejado deste Diário de Bordo para que a especificação e os artefatos sejam gerados.*
