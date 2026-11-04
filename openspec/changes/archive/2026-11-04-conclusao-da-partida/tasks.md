# Tasks

## 1. Resultados e identificação das embarcações

- [x] 1.1 Guardar em `src/app/app.ts` os resultados dos ataques recebidos pelo jogador, em paralelo aos resultados públicos dos ataques ao computador; testar que água, acerto e golpe destruidor são registrados uma vez por ataque válido, inclusive após turnos posteriores.
- [x] 1.2 Projetar `visaoJogador` a partir dos resultados recebidos e manter `visaoComputador` restrita a resultados públicos; testar que o golpe destruidor permanece identificado em ambos os tabuleiros e que posições adversárias intactas não aparecem no DOM.
- [x] 1.3 Exibir em `src/app/app.ts` nome da embarcação e coordenada no feedback de destruição por qualquer participante; testar mensagens para ambos os atacantes sem nome de embarcação em água ou acerto simples.
- [x] 1.4 Diferenciar em `src/app/componentes/tabuleiro-combate.*` a casa `destruida` de `acerto` por símbolo, estilo e rótulo textual; testar as duas visões, inclusive acessibilidade do rótulo e legibilidade em viewport estreita.

## 2. Desfecho explícito e nova partida

- [x] 2.1 Registrar desfecho explícito de vitória ou derrota apenas quando `frotaDestruida` for verdadeiro, mantendo bloqueio de ataques e tabuleiros visíveis; testar os dois golpes finais, ausência de ataque extra e ausência de resultado antes do fim.
- [x] 2.2 Apresentar em `src/app/app.html` resultado textual e botão nativo `Jogar novamente` somente na fase encerrada; testar renderização para os dois desfechos e acionamento por teclado, mouse ou toque.
- [x] 2.3 Centralizar no início da preparação a limpeza de turno, desfecho, ambos os históricos de resultados e tabuleiros, gerando nova frota do computador; testar reinício após vitória e derrota com frota humana vazia, cinco embarcações pendentes e sem marcas antigas.
- [x] 2.4 Testar em `src/app/app.spec.ts` o fluxo reinício → posicionamento completo → prontidão → segundo combate: nenhum ataque herdado, frota adversária oculta, primeiro turno do jogador e novo desfecho independente.

## 3. Verificação integrada

- [x] 3.1 Executar `npm test`, `npm run lint` e `npm run build`; conferir em telas móvel e desktop que resultado, tabuleiros e ação de reinício continuam operáveis sem revelar casas intactas do computador.
