# Design

## Context

Ver `proposal.md` — Why e os deltas em `specs/`. O shell em `src/app/app.ts` já controla fases, turno, tabuleiros e resultados públicos dos ataques ao computador; `registrarAtaque` informa `frotaDestruida` e, no golpe destruidor, `embarcacao`. O tabuleiro do jogador hoje é projetado a partir de ocupação e ataques recebidos, sem guardar o tipo de resultado desses ataques. `iniciarPreparacao()` recria tabuleiros, mas não limpa `resultadosComputador`.

## Goals / Non-Goals

**Goals:**

- Manter o desfecho e o reinício como estado da sessão Angular, sem alterar as operações puras do motor.
- Usar somente resultados públicos para projetar o tabuleiro adversário, mesmo após o encerramento.
- Preservar a distinção entre último golpe destruidor e acertos anteriores sem exigir histórico de partidas.

**Non-Goals:**

- Exibir a frota intacta do computador no fim; redefinir o resultado histórico de ataques anteriores; introduzir animações, atrasos ou serviço externo.

## Decisions

### 1. Resultado terminal como estado explícito

Adicionar ao shell um estado de desfecho `vitoria | derrota | null`. Atualizá-lo apenas quando `frotaDestruida` é verdadeiro, antes de apresentar a fase `encerrada`: vitória no golpe final do jogador, derrota no golpe final do computador. A interface anuncia o desfecho e mantém os tabuleiros somente leitura; `atacarComputador` continua verificando fase e turno para impedir chamadas diretas após o fim. O ramo defensivo de ausência de alvo não deve declarar vitória/derrota sem destruição confirmada; com frotas completas válidas, ele não é atingível durante combate normal.

**Alternativa:** deduzir o vencedor de `turno` ou de uma frase de `mensagem`. Isso acopla o resultado a detalhes transitórios e falha quando a resposta do computador encerra a partida.

### 2. Registrar resultados públicos dos ataques recebidos

Conservar também os resultados produzidos pelo computador em estado de sessão, paralelamente a `resultadosComputador`, e projetar `visaoJogador` a partir desses resultados e das posições próprias: água, acerto, destruída ou embarcação intacta. O resultado `destruida` identifica somente a casa do último golpe; acertos anteriores continuam identificados como acertos, mesmo quando a embarcação já está afundada. No tabuleiro adversário, continuar usando exclusivamente `resultadosComputador`; nunca passar `tabuleiroComputador` ao componente visual. Usar `embarcacao` do resultado destruidor e o mapeamento de nomes existente para mensagens com nome e coordenada, inclusive quando o computador ataca.

**Alternativa:** recalcular destruição da frota secreta no template ou marcar retroativamente todos os segmentos. A primeira abre risco de vazamento; a segunda altera o histórico de resultados e amplia a mudança além da identificação do golpe destruidor.

### 3. Diferenciar estados sem depender somente de cor

Manter o componente standalone `TabuleiroCombate` e a grade responsiva, mas dar à casa `destruida` símbolo distinto do acerto, estilo distinto e descrição textual legível; o estado não deve depender apenas de aparência. Na fase final, acrescentar título/mensagem com vitória ou derrota e botão nativo `Jogar novamente`, acionável por teclado e toque, sem substituir a região de status dos ataques. Não revelar posições adversárias não atacadas nem na tela final.

**Alternativa:** tela final isolada substituindo os tabuleiros. Impede conferir os ataques e acrescenta navegação desnecessária.

### 4. Reinício atômico da sessão

Reutilizar a entrada na preparação como único ponto de criação de nova partida, acrescentando a limpeza dos dois históricos de resultados, desfecho e turno, além dos tabuleiros, seleção e orientação. Exibir `Jogar novamente` somente na fase `encerrada`; a nova frota do computador é gerada de novo e o jogador deve reposicionar manualmente suas cinco embarcações. Testar reinício após vitória e derrota e um segundo combate para detectar marcas antigas ou desfecho residual.

**Alternativa:** reiniciar só as frotas na ação final. Os resultados públicos permanecem projetados nas casas da segunda partida.

## Risks / Trade-offs

- **Histórico da própria frota inconsistente com os ataques recebidos** → registrar cada resultado no mesmo ciclo em que `tabuleiroJogador` é atualizado; validar projeção após várias rodadas e no fim.
- **Desfecho ou marcas da sessão anterior persistirem** → concentrar todas as reinicializações na preparação e testar duas partidas consecutivas.
- **Informações secretas aparecerem no tabuleiro do computador** → manter projeção baseada apenas em resultados públicos e conferir DOM com frota controlada, inclusive após a vitória.
- **Marca visual de destruição confundida com acerto** → rótulo acessível e símbolo distinto além da cor, com verificação de interação por teclado e viewport estreita.

## Migration Plan

Não há persistência nem dados a migrar. A alteração é restrita à sessão em memória; o rollback restaura a apresentação básica de encerramento sem afetar partidas salvas, pois não existem.
