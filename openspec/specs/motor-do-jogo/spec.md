# motor-do-jogo Specification

## Purpose

Define as regras reutilizáveis da Batalha Naval para montar frotas válidas e resolver ataques em tabuleiros, independentemente da interface e da condução dos turnos.

## Requirements

### Requirement: Tabuleiro e coordenadas
O sistema SHALL reconhecer exclusivamente as 100 coordenadas de um tabuleiro de 10 linhas, de A a J, e 10 colunas, de 1 a 10.

#### Scenario: Coordenada válida na borda
- **WHEN** uma operação recebe a coordenada J10
- **THEN** a coordenada é reconhecida como a última posição válida do tabuleiro

#### Scenario: Coordenada fora do tabuleiro
- **WHEN** uma operação recebe uma linha fora de A a J ou uma coluna fora de 1 a 10
- **THEN** a operação rejeita a coordenada sem alterar o tabuleiro

### Requirement: Composição da frota
O sistema SHALL disponibilizar para cada participante uma frota composta por um porta-aviões de 5 posições, um encouraçado de 4, um cruzador de 3, um submarino de 3 e um destroyer de 2.

#### Scenario: Frota completa
- **WHEN** cada uma das cinco embarcações está posicionada uma vez e todas as posições são válidas
- **THEN** a frota é reconhecida como completa e válida

#### Scenario: Frota incompleta
- **WHEN** pelo menos uma das cinco embarcações não está posicionada
- **THEN** a frota não é reconhecida como completa

### Requirement: Posicionamento em linha reta
O sistema SHALL posicionar cada embarcação em posições consecutivas do seu tamanho, exclusivamente na horizontal ou na vertical e dentro do tabuleiro.

#### Scenario: Posicionamento horizontal válido
- **WHEN** um cruzador é posicionado horizontalmente a partir de B2
- **THEN** ele ocupa B2, B3 e B4

#### Scenario: Posicionamento vertical válido
- **WHEN** um destroyer é posicionado verticalmente a partir de I10
- **THEN** ele ocupa I10 e J10

#### Scenario: Posicionamento além da borda
- **WHEN** um porta-aviões é posicionado horizontalmente a partir de A8
- **THEN** a tentativa é rejeitada e a frota permanece inalterada

### Requirement: Ausência de sobreposição e reposicionamento seguro
O sistema SHALL rejeitar sobreposições sem modificar a frota válida existente e SHALL permitir substituir o posicionamento de uma embarcação antes da batalha, inclusive mantendo posições anteriores se a substituição for inválida. Embarcações encostadas são válidas.

#### Scenario: Sobreposição rejeitada
- **WHEN** uma embarcação é posicionada sobre uma posição ocupada por outra embarcação
- **THEN** a tentativa é rejeitada e as posições anteriormente válidas permanecem inalteradas

#### Scenario: Embarcações encostadas
- **WHEN** duas embarcações ocupam posições adjacentes, inclusive na diagonal, sem compartilhar coordenadas
- **THEN** ambas as posições são aceitas

#### Scenario: Reposicionamento válido
- **WHEN** uma embarcação já posicionada é movida para outra posição válida e livre
- **THEN** suas posições antigas são liberadas e somente as novas permanecem ocupadas

#### Scenario: Reposicionamento inválido
- **WHEN** o novo posicionamento de uma embarcação já posicionada ultrapassa a borda ou sobrepõe outra embarcação
- **THEN** a tentativa é rejeitada e as posições antigas permanecem ocupadas

### Requirement: Distribuição automática da frota do computador
O sistema SHALL gerar automaticamente uma frota completa para o computador, respeitando os mesmos tamanhos, limites e regras de sobreposição aplicados ao jogador.

#### Scenario: Frota gerada
- **WHEN** uma distribuição automática é solicitada
- **THEN** as cinco embarcações são posicionadas uma vez cada, em linha reta, dentro do tabuleiro e sem sobreposição

### Requirement: Resultado de um ataque válido
O sistema SHALL registrar um ataque a uma coordenada ainda não atacada do tabuleiro adversário e SHALL informar se o resultado foi água, acerto ou destruição da embarcação atingida, sem revelar posições intactas.

#### Scenario: Ataque na água
- **WHEN** uma coordenada livre é atacada pela primeira vez
- **THEN** o resultado é água e a coordenada passa a constar entre os ataques realizados

#### Scenario: Acerto sem destruição
- **WHEN** uma posição ocupada por embarcação com outras posições intactas é atacada pela primeira vez
- **THEN** o resultado é acerto e nenhuma outra posição intacta é marcada como atingida

#### Scenario: Última posição intacta
- **WHEN** a última posição intacta de uma embarcação é atacada pela primeira vez
- **THEN** o resultado identifica a embarcação como destruída

### Requirement: Rejeição de ataques inválidos
O sistema SHALL rejeitar coordenadas fora do tabuleiro e ataques repetidos, preservando os ataques já registrados e a integridade da frota.

#### Scenario: Coordenada repetida
- **WHEN** uma coordenada já atacada é atacada novamente no mesmo tabuleiro
- **THEN** o ataque é rejeitado sem criar um novo acerto ou alterar os registros anteriores

#### Scenario: Ataque fora do tabuleiro
- **WHEN** um ataque aponta para uma coordenada fora das 100 posições
- **THEN** o ataque é rejeitado e os registros de ataque permanecem inalterados

### Requirement: Destruição da frota
O sistema SHALL identificar uma frota completa como destruída somente quando todas as posições de todas as suas embarcações tiverem sido atingidas.

#### Scenario: Ainda há embarcações intactas
- **WHEN** uma frota completa contém ao menos uma posição de embarcação não atingida
- **THEN** a frota não é identificada como destruída

#### Scenario: Última embarcação destruída
- **WHEN** a última posição intacta da última embarcação de uma frota completa é atingida
- **THEN** a frota é identificada como destruída após esse ataque

#### Scenario: Frota incompleta não representa vitória
- **WHEN** uma frota ainda não está completa, mesmo que todas as embarcações posicionadas estejam atingidas
- **THEN** ela não é identificada como frota destruída para fins de vitória
