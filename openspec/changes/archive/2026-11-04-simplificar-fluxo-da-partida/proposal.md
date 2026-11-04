# Proposal

## Why

A partida exige dois passos dispensáveis antes do combate: uma apresentação inicial antes de posicionar a frota e uma tela de confirmação depois da preparação. Ao terminar, o resultado aparece em uma seção separada dos tabuleiros, afastando o desfecho do estado final da partida.

## What Changes

- Abrir a aplicação diretamente na preparação, com tabuleiro do jogador vazio, cinco embarcações pendentes e frota do computador gerada sem revelar suas posições; remover a apresentação inicial.
- Substituir o avanço para a tela de prontidão por uma ação única de iniciar combate na própria preparação, habilitada apenas com as duas frotas completas; não iniciar automaticamente ao posicionar a última embarcação.
- Apresentar vitória ou derrota em um overlay sobre o conjunto dos dois tabuleiros, mantendo o estado final visível, bloqueando ataques e oferecendo “Jogar novamente” para voltar à preparação limpa.
- Preservar as regras de posicionamento, ataques, alternância de turnos e ocultação da frota adversária.

## Capabilities

### New Capabilities

Nenhuma.

### Modified Capabilities

- `preparacao-da-partida`: entrada direta na preparação e ação de iniciar combate quando as duas frotas estiverem completas, sem tela inicial ou de prontidão.
- `combate-e-turnos`: início imediato do combate a partir da ação na preparação, com frotas preservadas e primeiro turno do jogador.
- `encerramento-da-partida`: resultado e reinício em overlay sobre os tabuleiros, mantendo o desfecho acessível e o reinício limpo.

## Impact

- Interface e estado de fases em `src/app/app.ts` e `src/app/app.html`; possivelmente estilos locais em `src/app/app.css`.
- Testes de fluxo, vitória, derrota, acessibilidade e reinício em `src/app/app.spec.ts`.
- Sem mudança nas regras do motor, APIs externas ou dependências.
