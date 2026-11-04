# Spec Delta

## ADDED Requirements

### Requirement: Identificação da embarcação destruída
O sistema SHALL identificar em português o nome da embarcação destruída por qualquer participante, junto com a coordenada do ataque que a destruiu, sem revelar posições adversárias ainda não atacadas.

#### Scenario: Jogador destrói embarcação do computador
- **WHEN** o jogador atinge a última posição intacta de uma embarcação do computador
- **THEN** o feedback informa a coordenada e o nome da embarcação destruída, sem expor outras posições adversárias não atacadas

#### Scenario: Computador destrói embarcação do jogador
- **WHEN** o computador atinge a última posição intacta de uma embarcação do jogador
- **THEN** o feedback informa a coordenada e o nome da embarcação destruída

### Requirement: Marcação persistente do golpe destruidor
O sistema SHALL distinguir a casa do ataque que destruiu uma embarcação de uma casa que recebeu somente um acerto, em ambos os tabuleiros, por indicação textual e visual não dependente apenas de cor.

#### Scenario: Golpe destruidor no tabuleiro adversário
- **WHEN** uma embarcação do computador é destruída e outros ataques ocorrem depois
- **THEN** a casa do golpe destruidor continua identificada como destruição, diferente de um acerto comum, sem revelar casas adversárias intactas

#### Scenario: Golpe destruidor no próprio tabuleiro
- **WHEN** uma embarcação do jogador é destruída pelo computador e outros ataques ocorrem depois
- **THEN** a casa do golpe destruidor continua identificada como destruição, diferente de um acerto comum
