# Spec Delta

## Purpose

Permitir que a pessoa inicie e prepare uma partida de Batalha Naval, organize sua frota com feedback claro e reconheça quando ambos os participantes estão prontos para o combate.

## ADDED Requirements

### Requirement: Entrada na preparação
O sistema SHALL oferecer uma apresentação inicial com uma ação para iniciar a preparação de uma partida.

#### Scenario: Início da preparação
- **WHEN** a pessoa aciona a opção de iniciar a partida na apresentação inicial
- **THEN** o sistema apresenta a preparação com o tabuleiro do jogador vazio e as cinco embarcações ainda não posicionadas

### Requirement: Visualização da frota em preparação
O sistema SHALL apresentar um tabuleiro de 10 linhas A–J e 10 colunas 1–10, junto com a composição da frota e o estado de posicionamento de cada embarcação.

#### Scenario: Frota parcial
- **WHEN** uma ou mais embarcações foram posicionadas e outras ainda faltam
- **THEN** o tabuleiro exibe as posições ocupadas e a lista identifica quais embarcações estão posicionadas e quais faltam

### Requirement: Escolha de embarcação e orientação
O sistema SHALL permitir selecionar uma das cinco embarcações e escolher a orientação horizontal ou vertical antes de indicar sua casa de origem.

#### Scenario: Seleção da embarcação
- **WHEN** a pessoa escolhe uma embarcação e a orientação vertical
- **THEN** a interface identifica a seleção atual e usa essa orientação na próxima tentativa de posicionamento

#### Scenario: Seleção de embarcação já posicionada
- **WHEN** a pessoa seleciona uma embarcação que já está no tabuleiro
- **THEN** a interface permite escolher outra origem e orientação para reposicioná-la

### Requirement: Posicionamento por casa de origem
O sistema SHALL posicionar ou reposicionar a embarcação selecionada ao receber a escolha de uma casa do tabuleiro, respeitando as regras do motor e preservando a frota válida em caso de falha.

#### Scenario: Posicionamento válido
- **WHEN** a pessoa seleciona um cruzador horizontal e escolhe B2 como origem livre
- **THEN** o tabuleiro mostra o cruzador em B2, B3 e B4 e o indica como posicionado

#### Scenario: Reposicionamento válido
- **WHEN** a pessoa escolhe uma nova origem e orientação válidas para uma embarcação já posicionada
- **THEN** somente as novas casas aparecem ocupadas por essa embarcação

#### Scenario: Embarcações encostadas
- **WHEN** a nova embarcação fica ao lado de outra sem compartilhar casas
- **THEN** a interface aceita a tentativa e apresenta ambas as embarcações

### Requirement: Erros de posicionamento recuperáveis
O sistema SHALL comunicar em português o motivo de uma tentativa inválida, sem perder a disposição anterior nem impedir nova tentativa.

#### Scenario: Ultrapassar a borda
- **WHEN** a pessoa tenta colocar um porta-aviões horizontal a partir de A8
- **THEN** a interface informa que a embarcação não cabe no tabuleiro e mantém as posições anteriores

#### Scenario: Sobreposição ao reposicionar
- **WHEN** a pessoa tenta mover uma embarcação para casas ocupadas por outra
- **THEN** a interface informa a sobreposição e mantém a embarcação em suas casas anteriores

### Requirement: Operação por teclado e toque
O sistema SHALL permitir selecionar embarcações, alterar orientação e escolher casas usando teclado, mouse ou toque, com identificação textual das ações e de seus resultados.

#### Scenario: Posicionar por teclado
- **WHEN** a pessoa navega até os controles e uma casa do tabuleiro usando teclado e os ativa
- **THEN** ela consegue executar a mesma tentativa de posicionamento disponível por clique ou toque

#### Scenario: Feedback sem depender de cor
- **WHEN** uma embarcação está selecionada ou uma tentativa falha
- **THEN** a interface indica textualmente o estado ou erro, sem depender apenas de cor

### Requirement: Prontidão das duas frotas
O sistema SHALL gerar uma frota completa para o computador sem exibir suas posições e permitir avançar somente quando as frotas do jogador e do computador estiverem completas.

#### Scenario: Frota incompleta
- **WHEN** falta posicionar qualquer uma das embarcações do jogador
- **THEN** a ação de avançar permanece indisponível e a interface indica que a preparação ainda não terminou

#### Scenario: Duas frotas completas
- **WHEN** a frota do jogador está completa e a do computador foi gerada integralmente
- **THEN** a ação de avançar fica disponível sem revelar as posições do computador

#### Scenario: Preparação concluída
- **WHEN** a pessoa aciona a opção de avançar com ambas as frotas prontas
- **THEN** o sistema conserva ambas as frotas e indica que a preparação foi concluída, sem efetuar ataques nesta etapa
