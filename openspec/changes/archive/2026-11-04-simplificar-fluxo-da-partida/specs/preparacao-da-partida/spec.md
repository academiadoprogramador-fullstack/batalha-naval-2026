# Spec Delta

## MODIFIED Requirements

### Requirement: Entrada na preparação
O sistema SHALL apresentar diretamente a preparação ao abrir a aplicação, sem exigir ação em uma apresentação inicial.

#### Scenario: Início da preparação
- **WHEN** a pessoa abre a aplicação para uma nova partida
- **THEN** a preparação aparece com o tabuleiro do jogador vazio, cinco embarcações pendentes e a frota do computador gerada sem exibir suas posições

### Requirement: Prontidão das duas frotas
O sistema SHALL gerar uma frota completa para o computador sem exibir suas posições e SHALL disponibilizar a ação de iniciar combate diretamente na preparação somente quando as frotas do jogador e do computador estiverem completas.

#### Scenario: Frota incompleta
- **WHEN** falta posicionar qualquer uma das embarcações do jogador ou a frota do computador não está completa
- **THEN** a ação de iniciar combate permanece indisponível e a interface indica que a preparação ainda não terminou

#### Scenario: Duas frotas completas
- **WHEN** a frota do jogador está completa e a do computador foi gerada integralmente
- **THEN** a ação de iniciar combate fica disponível na preparação, sem revelar as posições do computador e sem iniciar o combate automaticamente

#### Scenario: Preparação concluída
- **WHEN** a pessoa aciona a opção de iniciar combate com ambas as frotas prontas
- **THEN** o sistema conserva ambas as frotas e passa diretamente para o combate sem efetuar ataques durante a transição ou apresentar uma tela de confirmação intermediária
