## Why

Atualmente o aplicativo possui um botão para alternar entre "Dark Mode" e "Light Mode". Porém, o aplicativo foi projetado e construído utilizando classes com as cores estáticas e definidas no `tailwind.config.ts` voltadas exclusivamente para um estilo Dark (como `bg-[#0A1929]`, textos em branco, etc.). Como o "Light Mode" verdadeiro não existe nas classes de estilo e demandaria muito esforço para ser mapeado cor por cor, o botão na UI apenas confunde o usuário e não aplica efeito visível no Design. É melhor removê-lo para limpar a interface.

## What Changes

- Remoção do botão de alternância do Dark Mode/Light Mode do cabeçalho da aplicação.

## Capabilities

### New Capabilities
- Nenhuma

### Modified Capabilities
- `theme-context`: O requisito do botão de alternância será removido. O ThemeContext ainda pode existir subjacente caso seja necessário no futuro, mas o controle do usuário pela UI será removido.

## Impact
- Componente `src/components/Layout.tsx` terá o botão retirado.
