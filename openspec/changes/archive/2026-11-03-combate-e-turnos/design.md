# Design

## Context

Ver `proposal.md` — Why e `specs/combate-e-turnos/spec.md` — contrato. Hoje `src/app/app.ts` retém os dois `Tabuleiro` em sinais da sessão e transita de `preparacao` para `pronta`; `src/app/app.html` não oferece ação na fase pronta. O domínio puro em `src/app/dominio/motor-do-jogo.ts` já oferece `registrarAtaque`, que devolve novo tabuleiro, resultado e `frotaDestruida`, sem conduzir turnos. Cada `Tabuleiro` contém embarcações e ataques recebidos, inclusive as posições secretas do computador.

## Goals / Non-Goals

**Goals:**

- Integrar ataques sem reimplementar as regras do motor nem expor o tabuleiro secreto nos dados passados à visualização adversária.
- Fazer a alternância observável e testável, impedindo jogadas extras e escolhendo casas inéditas para o computador.
- Deixar a sessão pronta para a futura experiência final, sem permitir ataques depois da destruição de uma frota.

**Non-Goals:**

- Persistir ou sincronizar sessões, implementar inteligência de caça, alterar `registrarAtaque` ou construir a tela final completa nesta change.

## Decisions

### 1. Sessão e fronteira de entrada no combate

Manter `tabuleiroJogador` e `tabuleiroComputador` no shell, com fases `apresentacao`, `preparacao`, `pronta`, `combate` e `encerrada` e sinal de turno (`jogador`/`computador`). A fase `pronta` conserva a confirmação existente e oferece uma ação explícita para iniciar o combate, condicionada a `frotaCompleta` para ambos; o jogador começa. Ao encerrar, conservar tabuleiros e causa do encerramento em estado de sessão, bloquear novas jogadas e mostrar aviso básico. A tela final e a ação de reiniciar pertencem a outra change.

**Alternativas:** iniciar ataques imediatamente ao avançar da preparação (contradiz a confirmação já entregue); declarar vitória/derrota elaborada agora (amplia a change seguinte).

### 2. Orquestração de um ciclo de jogadas

Uma ação do jogador confere fase/turno e delega ao `registrarAtaque(tabuleiroComputador, coordenada)`. Em erro, não atualiza tabuleiro nem turno e dá feedback. Em sucesso, atualiza o tabuleiro do computador; se `frotaDestruida`, encerra antes da resposta. Caso contrário, passa para `computador`, escolhe uma coordenada dentre as 100 menos `tabuleiroJogador.ataques`, registra exatamente um ataque no tabuleiro do jogador, comunica os dois resultados e retorna ao jogador; se a frota do jogador acabou, encerra antes de devolver a vez. Preferir um pequeno módulo puro de condução/escolha com fonte aleatória injetável para testar sequência e casos-limite sem acoplar a lógica ao DOM; a escolha nunca altera o motor de regras.

**Alternativas:** confiar só no botão desabilitado (chamadas diretas poderiam repetir ataque); computador sortear do tabuleiro inteiro até encontrar posição livre (colisões crescem com a partida e tornam testes frágeis); cronômetro para simular turno (adiciona temporização/race sem benefício nesta fase).

### 3. Projeções distintas dos tabuleiros

Criar uma visão de combate standalone que receba a projeção do tabuleiro do jogador (embarcações, posições calculadas e ataques recebidos) e, do computador, apenas as coordenadas atacadas com seus resultados públicos. O shell conhece a frota secreta para resolver ataques; nunca passa `Tabuleiro` completo do computador ao componente visual. Para reconstruir acerto/água após outras jogadas, manter resultados públicos por coordenada em estado de sessão, derivados das respostas a `registrarAtaque`; não inferir água a partir da frota secreta no template. O resultado `destruida` corresponde ao último segmento atingido, sem revelar outros segmentos intactos.

**Alternativas:** passar o tabuleiro adversário inteiro e esconder embarcações por CSS (vazamento no DOM/modelo); recalcular resultado a partir de posições secretas diretamente na visualização (quebra a fronteira e risco de revelar informação).

### 4. Acessibilidade e apresentação

Reutilizar o padrão de grade A–J × 1–10 e botões nativos existente: tabuleiro adversário acionável durante o turno do jogador, inclusive nas casas já atacadas para comunicar a recusa de repetição; tabuleiro próprio somente leitura, com rótulos de embarcações e ataques. Texto e nomes acessíveis descrevem coordenada e estado (não só cor); feedback em região de status anuncia resultado do jogador, resultado do computador, turno e tentativas inválidas. Em telas estreitas, empilhar as duas regiões e limitar sua largura, preservando casas acionáveis e rolagem localizada se necessária.

**Alternativas:** revelar o tabuleiro adversário sob o do jogador; usar drag-and-drop ou células sem nome acessível.

## Risks / Trade-offs

- **Resultado de ataques anteriores perdido** → guardar a projeção pública indexada por coordenada e cobrir sucessão de acertos/água/destruição em testes.
- **Resposta automática ocultar a alternância** → atualizar explicitamente o turno e anunciar os dois ataques em ordem, mesmo se forem concluídos no mesmo ciclo de interação.
- **Vazamento da frota adversária** → teste de interface com frota controlada verifica que casas secretas não constam nos dados/DOM da visualização e que só surgem resultados após ataque.
- **Último golpe gerar ataque extra** → testes para destruição de qualquer uma das frotas, verificando que a segunda jogada não ocorre e que a fase bloqueia ataques.
- **Dois tabuleiros apertados no celular** → regiões empilhadas e inspeção de viewport, sem sacrificar nomes acessíveis nem área de interação.

## Migration Plan

Não há dados persistidos a migrar. A implementação acrescenta a fase de combate após a tela de prontidão, preservando os estados anteriores; reverter a camada de condução/visualização mantém o fluxo de preparação e o motor existentes.
