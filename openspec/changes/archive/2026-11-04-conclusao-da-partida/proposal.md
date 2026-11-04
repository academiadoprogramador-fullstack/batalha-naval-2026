# Proposal

## Why

O combate já bloqueia ataques ao destruir uma frota, mas não deixa explícito se a pessoa venceu ou perdeu nem oferece uma nova partida. Além disso, a destruição de cada embarcação não fica identificada de maneira persistente e inequívoca nos tabuleiros.

## What Changes

- Apresentar vitória ou derrota em português ao encerrar o combate, mantendo os dois tabuleiros e impedindo novos ataques.
- Oferecer ação de jogar novamente que volta à preparação, com frota humana vazia, nova frota automática e nenhum resultado ou ataque herdado.
- Identificar pelo nome cada embarcação destruída no feedback e distinguir destruição de acerto nas casas já atacadas, sem revelar posições adversárias intactas.
- Cobrir os dois desfechos e o ciclo de uma segunda partida com testes de interface.

**Fora do escopo:** pontuação, histórico entre partidas, persistência, estratégia de combate, multiplayer e alterações nas regras de ataque ou posicionamento do motor.

## Capabilities

### New Capabilities

- `encerramento-da-partida`: desfecho explícito, apresentação final e reinício limpo de uma partida na mesma sessão.

### Modified Capabilities

- `combate-e-turnos`: aprimorar o feedback de destruição com nome da embarcação e indicação persistente, distinta de acerto, nos tabuleiros sem vazamento da frota adversária.

## Impact

- Orquestração de sessão e interface em `src/app/app.ts`, `src/app/app.html` e componente `src/app/componentes/tabuleiro-combate.*`; testes de interface em `src/app/app.spec.ts` e, se útil, do componente.
- Reutiliza `ResultadoAtaque.embarcacao`, `calcularPosicoes`, `criarTabuleiro` e `gerarFrota` existentes; não requer API, nova dependência ou mudança em `src/app/dominio/motor-do-jogo.ts`.
