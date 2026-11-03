# Tasks

## 1. Entrada e estado de preparação

- [x] 1.1 Integrar ao shell as fases `apresentacao`, `preparacao` e `pronta` com sinais e ação de iniciar, mantendo o cabeçalho; testar que iniciar mostra jogador com tabuleiro vazio e cinco embarcações pendentes.
- [x] 1.2 Criar e reter na sessão a frota do computador com `gerarFrota` ao iniciar, sem passá-la ao componente visual; testar `frotaCompleta` para o computador e ausência das suas posições na interface.

## 2. Tabuleiro e controles de preparação

- [x] 2.1 Apresentar tabuleiro do jogador A–J × 1–10 com casas acionáveis e indicação das casas ocupadas derivada de `calcularPosicoes`; testar 100 coordenadas com rótulos e a atualização visual após colocar uma embarcação.
- [x] 2.2 Apresentar os cinco tipos com nomes, tamanhos e estados, seleção da embarcação e orientação horizontal/vertical; testar que uma embarcação já posicionada pode ser selecionada de novo e que a orientação escolhida é aplicada.
- [x] 2.3 Ajustar o tabuleiro e controles para viewport estreita e interação por toque/teclado, usando controles nativos e feedback textual; verificar navegação e acionamento por teclado em teste de interface e inspecionar viewport móvel sem cortar casas ou controles.

## 3. Posicionamento e feedback

- [x] 3.1 Ligar escolha da casa a `posicionarEmbarcacao` e atualizar o tabuleiro apenas no sucesso; testar B2–B4, embarcações adjacentes e manutenção da frota anterior em A8 horizontal para porta-aviões e em sobreposição.
- [x] 3.2 Permitir reposicionar a embarcação selecionada na nova origem/orientação, usando a operação do motor e feedback em português para borda/sobreposição; testar movimento válido e que falhas preservam as casas anteriores e permitem nova tentativa.
- [x] 3.3 Identificar seleção, estado das embarcações e erros sem depender apenas de cor e anunciar os resultados em região de status; testar nomes acessíveis das ações e texto visível após falha/sucesso.

## 4. Prontidão e passagem de fase

- [x] 4.1 Derivar a disponibilidade de avançar da completude de ambos os tabuleiros; testar botão indisponível com frota parcial e disponível somente com as cinco embarcações posicionadas e frota do computador completa.
- [x] 4.2 Ao avançar, preservar as duas frotas e exibir a confirmação de preparação concluída sem ataques nem posições secretas; testar que a fase muda e que a interface não oferece combate nem revela a frota do computador.

## 5. Verificação integrada

- [x] 5.1 Executar `npm test`, `npm run lint` e `npm run build` e verificar que o fluxo de apresentação → preparação → prontidão funciona sem modificar as regras puras de `src/app/dominio/` nem introduzir turnos.
