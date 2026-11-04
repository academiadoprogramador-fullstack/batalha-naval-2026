# Spec Delta

## MODIFIED Requirements

### Requirement: Resultado explícito da partida
O sistema SHALL indicar em português se a pessoa venceu ou perdeu em um overlay sobre o conjunto dos dois tabuleiros quando uma das frotas completas for destruída, mantendo o estado final dos tabuleiros visível e impedindo novos ataques naquela partida.

#### Scenario: Vitória do jogador
- **WHEN** um ataque do jogador destrói a última posição intacta da frota do computador
- **THEN** a partida termina imediatamente, o overlay indica explicitamente a vitória e oferece jogar novamente sobre os tabuleiros com os resultados preservados, sem conceder nova jogada ao computador

#### Scenario: Derrota do jogador
- **WHEN** um ataque do computador destrói a última posição intacta da frota do jogador
- **THEN** a partida termina imediatamente, o overlay indica explicitamente a derrota e oferece jogar novamente sobre os tabuleiros com os resultados preservados, sem habilitar nova jogada do jogador

#### Scenario: Combate ainda em andamento
- **WHEN** nenhuma das frotas foi destruída
- **THEN** o sistema não apresenta vitória ou derrota nem oferece a ação de jogar novamente

### Requirement: Ação final acessível
O sistema SHALL apresentar resultado e ação de jogar novamente em português no overlay, de forma identificável sem depender exclusivamente de cores, acionável por teclado, mouse ou toque e com foco acessível após o encerramento.

#### Scenario: Reinício por teclado
- **WHEN** a pessoa navega até a ação de jogar novamente após o desfecho e a ativa pelo teclado
- **THEN** inicia-se a mesma preparação limpa disponível por clique ou toque

#### Scenario: Foco no desfecho
- **WHEN** a partida termina com vitória ou derrota e o overlay aparece
- **THEN** o foco é encaminhado à ação de jogar novamente e as casas de ataque não permanecem interativas enquanto o resultado está exibido
