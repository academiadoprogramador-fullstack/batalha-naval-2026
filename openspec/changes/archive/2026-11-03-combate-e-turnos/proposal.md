# Proposal

## Why

A preparação termina com as duas frotas prontas, mas não existe uma partida jogável: a tela de prontidão não oferece ataques nem turnos. O motor já resolve ataques; falta conduzir o combate sem expor a frota secreta do computador.

## What Changes

- Permitir iniciar o combate a partir da preparação concluída, preservando as duas frotas.
- Exibir o tabuleiro do jogador e uma visão de ataques ao computador que nunca revele embarcações intactas; oferecer ataques por toque, mouse e teclado.
- Fazer o jogador começar; cada ataque válido alterna o turno, mesmo após acerto, e o computador ataca automaticamente uma casa ainda não atacada.
- Informar água, acerto e embarcação destruída; ataques repetidos ou fora do turno não alteram o estado nem consomem o turno.
- Interromper novos ataques quando uma frota for destruída, com aviso básico de encerramento. A experiência completa de vitória/derrota e nova partida fica para outra change.

**Fora do escopo:** tela final detalhada, reinício, placar, estratégias avançadas do computador, multiplayer, persistência e alterações nas regras puras de posicionamento ou ataque.

## Capabilities

### New Capabilities

- `combate-e-turnos`: condução da partida entre jogador e computador, projeções seguras dos tabuleiros, alternância de turnos e encerramento seguro dos ataques.

### Modified Capabilities

Nenhuma. `motor-do-jogo` já especifica o resultado e a rejeição de ataques; `preparacao-da-partida` continua responsável por deixar as frotas prontas antes do combate.

## Impact

- Orquestração da sessão e apresentação em `src/app/`, com novos testes de interface e fluxo; reutilização de `registrarAtaque` e `calcularPosicoes` em `src/app/dominio/motor-do-jogo.ts`.
- Interface em português, responsiva e acessível; sem API externa, armazenamento persistente ou nova dependência de execução.
