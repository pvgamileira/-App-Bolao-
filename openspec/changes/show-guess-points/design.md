## Context

O frontend hoje já exibe "Seu palpite registrado: X x Y" na renderização dos jogos que acabaram. Porém, `pontos_ganhos` não está sendo trafegado do `App.tsx` para o `MatchGrid.tsx`. E não há um painel ou aviso sobre quantos pontos estão "na mesa" naquele dia (o Potencial da Rodada).

## Goals / Non-Goals

**Goals:**
- Mudar a interface `Guess` para suportar `points?: number | null`.
- Incluir `pontos_ganhos` na query que busca os palpites em `App.tsx`.
- Exibir a pontuação ganha na UI, junto ao palpite registrado, usando as cores e estilos do app (verde chamativo, `+X pts`).
- Criar um botão "Potencial da Rodada" na interface do `MatchGrid` que abra um alerta ou modal nativo amigável, mostrando a quantidade máxima de pontos que podem ser ganhos (jogos * 5).

**Non-Goals:**
- Nenhuma alteração no backend ou na fórmula de cálculo (RLS e Edge functions continuam como estão).
- Criar modais complexos com bibliotecas de terceiros (usar UI simples, como o `window.alert` ou um painel embutido simples).

## Decisions

1. **State Update em App.tsx:**
A query passará a ser `.select('jogo_id, palpite_a, palpite_b, pontos_ganhos')`. Ao armazenar em `newGuesses`, colocaremos `points: p.pontos_ganhos`.

2. **UI no MatchGrid.tsx:**
No bloco:
```tsx
{match.status === 'FINISHED' && savedGuesses[match.id] && savedGuesses[match.id].scoreA !== '' && (
```
Vamos adicionar um badge de pontos. E se for 0, mostraremos um badge cinza neutro (ex: `+0 pts`). Se for > 0, verde.

3. **Potencial do Dia:**
No Header do `MatchGrid`, logo abaixo das abas, adicionaremos um container:
"💰 Pontos em Jogo: Calcula-se `(Jogos SCHEDULED/LIVE daquela visualização) * 5`."
Pode ser só um banner estático, o que é mais limpo que um modal, ou um botão que clica e mostra um alert customizado. O usuário pediu "modal", vamos fazer um botão que abre uma janela (alert ou pequeno div expansível) explicando a regra. Um banner com um texto claro será implementado.
