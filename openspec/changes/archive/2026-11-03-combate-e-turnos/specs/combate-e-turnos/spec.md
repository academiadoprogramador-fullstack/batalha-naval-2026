# Spec Delta

## Purpose

Permitir uma partida de Batalha Naval entre jogador e computador com ataques alternados, feedback de cada jogada e proteção das posições ainda secretas da frota adversária.

## ADDED Requirements

### Requirement: Entrada no combate
O sistema SHALL permitir iniciar o combate somente depois que as frotas dos dois participantes estiverem completas, preservando suas disposições.

#### Scenario: Combate após preparação
- **WHEN** a preparação é concluída com as duas frotas completas e a pessoa inicia o combate
- **THEN** o sistema apresenta os tabuleiros de combate com as frotas preservadas e indica que é a vez do jogador

#### Scenario: Preparação incompleta
- **WHEN** uma das frotas ainda não está completa
- **THEN** o combate não pode ser iniciado

### Requirement: Visões dos tabuleiros de combate
O sistema SHALL mostrar o próprio tabuleiro com suas embarcações e ataques recebidos e SHALL mostrar o tabuleiro adversário apenas com os resultados de ataques já realizados.

#### Scenario: Nenhuma posição adversária revelada
- **WHEN** o combate começa e ainda não houve ataques ao computador
- **THEN** nenhuma posição de embarcação do computador aparece na interface

#### Scenario: Marcas após ataques
- **WHEN** um ataque é registrado em qualquer tabuleiro
- **THEN** sua coordenada passa a exibir água, acerto ou destruição conforme o resultado, sem revelar outras posições adversárias intactas

### Requirement: Ataque do jogador
O sistema SHALL permitir atacar uma coordenada do computador somente durante o turno do jogador e SHALL apresentar o resultado da tentativa.

#### Scenario: Ataque válido
- **WHEN** o jogador escolhe uma coordenada ainda não atacada durante seu turno
- **THEN** a jogada é registrada no tabuleiro do computador e o resultado é comunicado em português

#### Scenario: Ataque repetido
- **WHEN** o jogador tenta atacar uma coordenada já atacada
- **THEN** a tentativa é recusada com explicação, sem alterar as frotas, os ataques registrados ou o turno

#### Scenario: Ataque fora do turno
- **WHEN** a pessoa tenta atacar enquanto é a vez do computador
- **THEN** nenhuma jogada é registrada nem o turno é alterado

### Requirement: Alternância e ataque do computador
O sistema SHALL alternar os turnos após cada ataque válido, mesmo em caso de acerto, e SHALL realizar automaticamente um ataque do computador a uma casa do jogador ainda não atacada.

#### Scenario: Acerto não concede novo ataque
- **WHEN** o jogador acerta uma embarcação sem encerrar o combate
- **THEN** o turno passa ao computador, que realiza uma jogada válida, antes de o jogador poder atacar novamente

#### Scenario: Ataque do computador não repetido
- **WHEN** chega o turno do computador e o combate continua
- **THEN** ele escolhe uma das coordenadas ainda não atacadas do jogador, registra uma única jogada e devolve o turno ao jogador

#### Scenario: Resultado do computador
- **WHEN** o computador ataca uma casa do jogador
- **THEN** a casa e o feedback identificam o resultado sem alterar a disposição das embarcações

### Requirement: Encerramento seguro dos ataques
O sistema SHALL impedir novos ataques assim que uma das frotas completas for destruída e SHALL indicar de forma básica que o combate terminou.

#### Scenario: Último ataque do jogador
- **WHEN** o ataque do jogador destrói a última posição intacta da frota do computador
- **THEN** o combate termina sem executar outro ataque do computador

#### Scenario: Último ataque do computador
- **WHEN** o ataque do computador destrói a última posição intacta da frota do jogador
- **THEN** o combate termina sem habilitar outra jogada do jogador

### Requirement: Operação acessível do combate
O sistema SHALL permitir atacar por mouse, toque ou teclado e SHALL identificar textualmente os tabuleiros, a vez de jogar e os resultados sem depender somente de cores.

#### Scenario: Ataque por teclado
- **WHEN** a pessoa navega até uma casa adversária disponível e a ativa pelo teclado durante seu turno
- **THEN** o mesmo ataque disponível por clique ou toque é realizado

#### Scenario: Feedback legível
- **WHEN** ocorre um ataque válido ou uma tentativa recusada
- **THEN** uma região de status anuncia em português a coordenada, o resultado ou o motivo da recusa e informa de quem é a vez
