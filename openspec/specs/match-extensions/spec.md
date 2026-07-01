# Match Extensions

## Purpose
Define the behavior for matches that go to overtime or penalty shootouts.

## Requirements

### Requirement: Registro de Prorrogação e Pênaltis no Banco de Dados
A tabela de `jogos` DEVE conter colunas para registrar a extensão da partida e seu vencedor em caso de pênaltis.

#### Scenario: Jogo vai para pênaltis
- **WHEN** uma partida de mata-mata termina empatada e vai para os pênaltis
- **THEN** o sistema permite registrar `foi_para_penaltis = true` e `vencedor_penaltis` igual a 'A' ou 'B'.

### Requirement: Exibição Visual de Prorrogação
O frontend DEVE indicar visualmente quando um jogo foi decidido na prorrogação.

#### Scenario: Jogo decidido na prorrogação
- **WHEN** a partida tem a flag `foi_para_prorogacao = true` e `foi_para_penaltis = false`
- **THEN** o card da partida exibe um badge indicando "Prorrogação".

### Requirement: Exibição Visual de Pênaltis
O frontend DEVE destacar o vencedor da disputa de pênaltis na UI, já que o placar em gols (oficial) estará empatado.

#### Scenario: Exibição do vencedor dos pênaltis
- **WHEN** a partida tem a flag `foi_para_penaltis = true`
- **THEN** o card da partida exibe um badge de "Pênaltis" e destaca visualmente a bandeira ou nome do time que tem a flag `vencedor_penaltis` correspondente.
