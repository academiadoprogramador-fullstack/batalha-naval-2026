# Spec Delta

## MODIFIED Requirements

### Requirement: Entrada no combate
O sistema SHALL permitir iniciar o combate diretamente pela ação disponível na preparação somente depois que as frotas dos dois participantes estiverem completas, preservando suas disposições.

#### Scenario: Combate após preparação
- **WHEN** as duas frotas estão completas e a pessoa aciona iniciar combate na preparação
- **THEN** o sistema apresenta imediatamente os dois tabuleiros de combate com as frotas preservadas, sem tela intermediária ou ataques registrados, e indica que é a vez do jogador

#### Scenario: Preparação incompleta
- **WHEN** uma das frotas ainda não está completa
- **THEN** o combate não pode ser iniciado
