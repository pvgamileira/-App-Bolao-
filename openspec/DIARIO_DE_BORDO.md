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

### 2. [PRIORIDADE MÁXIMA] Correção do Bug de Prorrogação e Pênaltis
**Contexto:** Atualmente o sistema não lida corretamente com jogos que passam dos 90 minutos normais (prorrogação) e vão para disputa de pênaltis. É preciso registrar o resultado do tempo normal separadamente.
**O que precisa ser feito:**
- O sistema precisa reconhecer automaticamente quando a partida acaba além do tempo normal.
- Registrar o resultado pós-tempo normal e, caso vá para pênaltis, capturar o vencedor da disputa.
- Criar uma UI intuitiva para o usuário entender claramente que o jogo foi decidido nos pênaltis e quem foi o vencedor final.

### 3. Versionamento Visível (App Version)
**Contexto:** Facilitar o acompanhamento de quais novidades já estão em produção para os usuários finais.
**O que precisa ser feito:**
- Adicionar uma tag de versão (ex: `v1.0.1`) visível na tela inicial de login/cadastro e possivelmente no rodapé do aplicativo.
- Estabelecer uma lógica simples de incremento (ex: arquivo `.env` ou hardcoded no `Layout.tsx`).

### 4. Integração de API de Placar em Tempo Real
**Contexto:** Tornar a experiência de acompanhamento mais rica e dinâmica durante os jogos ao vivo, sem precisar que o usuário saia do app para conferir como o jogo está.
**O que precisa ser feito:**
- Buscar pela edge function da API da ESPN os placares e status dos jogos.
- Exibir dinamicamente o tempo de jogo (minutos decorridos) e o placar oficial atualizado em tempo real.
- Mostrar esses dados ao lado ou embaixo do modal de palpites do respectivo jogo na interface do usuário.

### 5. Correção da Regra de Pontuação
**Contexto:** O banco de dados atual não está calculando os pontos corretamente de acordo com a regra oficial do bolão (não está dando 3 pontos por acertar o vencedor).
**O que precisa ser feito:**
- Atualizar a trigger de pontuação (`update_user_points_on_match_finish`) para aplicar a nova regra:
  - **Placar cravado:** 5 pontos.
  - **Acertou o vencedor ou o empate:** 3 pontos.
  - **Bônus (somente se não cravou o placar, mas acertou o vencedor/empate):**
    - +1 ponto se acertou a diferença de gols.
    - +1 ponto se acertou os gols do time perdedor (não existe em empates).
    - +1 ponto se o jogo real foi goleada (diferença de 4 gols ou mais).
  - A pontuação máxima por jogo é de 5 pontos.

### 6. Sistema de Múltiplos Bolões e Convites (Multitenancy)
**Contexto:** O objetivo é distribuir o aplicativo para outras pessoas e grupos poderem usar de forma isolada. Atualmente, todos os usuários e jogos compartilham um único ranking global.
**O que precisa ser feito:**
- **Nova Entidade `Bolão` (ou Grupo):** Criar uma tabela no Supabase para representar um "Bolão", contendo um código de convite único.
- **Relação N:N (Usuários <-> Bolões):** 1 usuário pode participar de N bolões. Os líderes de bolão podem gerenciar quem participa.

**O Roadmap de Implementação (Bolão V2):**
A implementação deste épico foi fatiada em 5 fases isoladas para garantir 100% de segurança e permitir aprendizado contínuo:
- **Fase 1: O Alicerce Oculto (DB):** Criação das tabelas de `ligas`, `membros_liga` e migração silenciosa dos usuários atuais para a Liga Oficial. Criação das políticas de segurança RLS.
- **Fase 2: Motor de Tela (UX & Palpites Híbridos):** UI para seleção de ligas e checkbox "Aplicar a todas as ligas" na hora do palpite.
- **Fase 3: Regras Customizadas:** Refatoração da Trigger de pontos para ler as regras (ex: pontos por cravar) diretamente das configurações da liga do usuário.
- **Fase 4: O Radar ESPN (Multi-Campeonatos):** Refatoração da Edge Function para consultar simultaneamente múltiplos IDs de campeonatos (Série A, Champions, Copa).
- **Fase 5: O Cassino (Desafios 1x1):** Criação do sistema de apostas (Modo Gamificado valendo pontos e Modo Juiz valendo valores externos com "Termos de Uso" de isenção de responsabilidade).

### 7. [CONCLUÍDO] Reformulação Completa do Front-End (Design e Estilização)
**Contexto:** O aplicativo precisa de uma nova identidade visual mais moderna e atraente (UI/UX) para engajar melhor os usuários, mas mantendo o motor e a lógica intactos.
**O que precisa ser feito:**
- Refatorar toda a camada de estilização do aplicativo (CSS/Tailwind).
- Preservar rigorosamente a lógica atual de estados, rotas, chamadas ao Supabase e regras de negócio.
- Aplicar um design premium e dinâmico, utilizando micro-interações, cores modernas e uma hierarquia visual clara, conforme as diretrizes de estética (Web Application Development guidelines).

---

## ⚠️ Dívida Técnica (Pós-Copa)

### 1. Refatoração Completa do Sistema de Autenticação
**Contexto:** Para não travar o app durante o torneio, adotamos temporariamente o padrão de "Login Transparente Sincronizado" (Shadow Auth). Mascaramos o login legad (via PIN) em um e-mail fantasma dentro do `auth.users` para ativar as políticas RLS de segurança do Supabase sem gerar fricção ao usuário.
**O que precisa ser feito pós-copa:**
- Remover o sistema de "e-mails fantasmas".
- Implementar um fluxo real e seguro de autenticação (ex: Magic Link, Google Auth, ou E-mail/Senha verdadeiro).
- Refatorar o Frontend para remover o preenchimento de zeros no PIN e padronizar o Auth com as melhores práticas da indústria.

---

*Nota: Apenas a primeira etapa "Fix First Access" e a correção de "Live Match Lock and Points Sync" foram implementadas. Ao solicitar a implementação de qualquer um desses pontos, utilize `/opsx-propose` mencionando o item desejado deste Diário de Bordo para que a especificação e os artefatos sejam gerados.*
