## Context

A interface do aplicativo não tem estilos light implementados, utilizando cores hardcoded na configuração do tailwind, o que faz com que o botão de alternância do Dark Mode confunda a navegação.

## Goals / Non-Goals

**Goals:**
- Remover o ícone do botão de toggle no cabeçalho do `Layout.tsx`.

**Non-Goals:**
- Remover toda a lógica interna de `ThemeContext` pois ela não causa dano e já carrega `dark` por padrão.

## Decisions
1. Deletar a tag `<button>` em `src/components/Layout.tsx` responsável pelo `toggleTheme`.

## Risks / Trade-offs
- Os imports do `toggleTheme`, `Moon`, `Sun` ficarão obsoletos no arquivo, portanto deverão ser limpados também para não gerar warnings de lint.
