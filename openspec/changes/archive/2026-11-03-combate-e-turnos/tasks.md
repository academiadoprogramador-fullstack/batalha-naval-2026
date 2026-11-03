# Tasks

## 1. Entrada e condução da sessão

- [x] 1.1 Acrescentar às fases do shell a entrada explícita da tela `pronta` em `combate`, condicionada à completude das duas frotas e sem regenerá-las; testar que a preparação permanece acessível até concluir ambas, e que o primeiro turno pertence ao jogador.
- [x] 1.2 Implementar condução de ataques do jogador com `registrarAtaque`, validando fase/turno e rejeitando repetição sem mutação nem perda de turno; testar ataque válido, acerto, água, repetição e tentativa fora do turno com estado controlado.
- [x] 1.3 Implementar escolha dentre coordenadas ainda não atacadas e resposta automática única do computador, com fonte aleatória injetável e alternância inclusive após acerto; testar sequências determinísticas, ausência de repetição e retorno do turno ao jogador.
- [x] 1.4 Encerrar o combate após `frotaDestruida` de qualquer participante sem ataque extra e conservar frotas/resultados na sessão; testar as duas direções do golpe final e bloquear ações posteriores.

## 2. Visões seguras e feedback

- [x] 2.1 Criar projeção pública de ataques ao computador a partir dos resultados registrados, sem passar seu `Tabuleiro` secreto à visão standalone; testar que água/acerto/destruição anteriores persistem e que posições intactas não aparecem nem na visão nem no DOM.
- [x] 2.2 Construir dois tabuleiros A–J × 1–10 com nomes acessíveis: próprio com embarcações e ataques recebidos, adversário com resultados públicos e botões de ataque; testar rótulos, clique e que uma casa repetida comunica recusa sem alterar o turno.
- [x] 2.3 Anunciar em português os resultados do jogador e do computador, a vez atual, a recusa de tentativas e o encerramento básico em região de status; testar textos e anúncio após acerto, erro e golpe final, sem depender só de cor.
- [x] 2.4 Ajustar disposição dos dois tabuleiros para desktop e viewport móvel com casas proporcionais, controles de toque e teclado; testar foco/acionamento por teclado e inspecionar visualmente viewport estreita sem vazamento ou corte de controles.

## 3. Verificação integrada

- [x] 3.1 Exercitar em teste de interface a sequência preparação → pronta → combate → ataque do jogador → resposta do computador → encerramento, incluindo a preservação das frotas e a ausência de informações secretas; executar `npm test`, `npm run lint` e `npm run build` sem alterar as regras puras de `src/app/dominio/motor-do-jogo.ts`.
