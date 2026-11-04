# Design

## Context

`App` concentra os sinais de fase, frota, turno, mensagens e desfecho. Hoje a fase inicial é `apresentacao`, o método `iniciarPreparacao` cria a frota do computador, `avancar` troca para `pronta` e `iniciarCombate` troca para `combate`; o resultado aparece depois do grid dos tabuleiros. Os deltas em `specs/` substituem as duas etapas intermediárias e deslocam o resultado para o container dos tabuleiros. Os componentes de tabuleiro já exibem as marcas de ataque e recebem `permitirAtaque` conforme a fase.

## Goals / Non-Goals

**Goals:**
- Reduzir o fluxo de fases à preparação, ao combate e ao encerramento, mantendo a confirmação explícita da frota em uma única ação.
- Reutilizar a mesma inicialização de partida no primeiro acesso e no reinício, sem introduzir estado transitório de frota incompleta do computador na interface.
- Posicionar o desfecho em uma camada sobre os dois tabuleiros, com gerenciamento de foco e interação consistente em telas estreitas.

**Non-Goals:**
- Alterar regras de posicionamento, ataque, alternância ou geração de frota.
- Criar uma rota, serviço, biblioteca de modal ou tela de histórico da partida.

## Decisions

### 1. Simplificar a máquina de fases em `App`

Inicializar a aplicação em `preparacao`, com tabuleiro do jogador vazio e frota do computador já gerada, e reutilizar `iniciarPreparacao` para limpar ataques, desfecho, orientações e frotas no reinício. Substituir o par `avancar`/`iniciarCombate` por uma única transição protegida: somente da preparação e com `podeAvancar()` verdadeiro para combate. O clique não registra ataque; o primeiro turno é do jogador. Remover as ramificações de `apresentacao` e `pronta` do template.

Alternativas descartadas: iniciar automaticamente ao posicionar o quinto navio (retiraria a oportunidade de reposicionar antes de confirmar) e manter a tela `pronta` (preserva o clique redundante).

### 2. Renderizar a camada final dentro do container compartilhado dos tabuleiros

Tornar o wrapper do grid a referência de posicionamento e renderizar nele, apenas com `fase() === 'encerrada'` e `desfecho()` definido, uma camada absoluta com fundo semitransparente e cartão central responsivo, contendo título explícito e botão “Jogar novamente”. Manter ambos os componentes de tabuleiro montados e a mensagem de status existente; deixar a camada interceptar ponteiro e impedir ataques pela guarda de fase já existente. Como `permitirAtaque` fica falso no fim, as casas adversárias deixam de ser botões de ataque sem perder suas marcas finais.

Alternativas descartadas: seção de resultado após os tabuleiros (separa resultado e partida) e overlay individual em cada tabuleiro (duplicaria a ação e fragmentaria o desfecho).

### 3. Conduzir o foco ao reinício sem perder o feedback da jogada final

Quando o desfecho surgir, focar a ação “Jogar novamente” após sua renderização, de modo que o botão esteja visível e seja operável por teclado; manter o texto do desfecho associado ao cartão e o anúncio da jogada final na região de status. Ao reiniciar, devolver o foco a um controle ou título identificável da preparação, pois o botão do overlay será removido. Evitar expor controles de ataque sob a camada. Validar a posição do cartão em viewport estreita, onde os tabuleiros ficam empilhados.

Alternativa descartada: confiar apenas na sequência de Tab após a última casa atacada, cujo botão é substituído no encerramento e pode deixar o foco sem destino útil.

## Risks / Trade-offs

- [Cartão encobre parte das marcas finais] → usar fundo translúcido, cartão compacto e manter o grid montado; conferir legibilidade e rolagem em viewport móvel.
- [Transição a partir de estado incompleto ou fase errada] → manter guarda de fase e prontidão no manipulador além do botão desabilitado.
- [Foco perdido ao substituir células interativas ou remover o overlay] → direcionar foco no encerramento e no reinício; cobrir ambos os caminhos em testes de componente.
- [Testes acoplados aos botões antigos] → atualizar seletores e fluxos de `app.spec.ts` para a entrada direta e a única ação de início, preservando as verificações de combate e reinício.

## Migration Plan

Mudança local de interface, sem persistência ou migração de dados. Atualizar estado, template e testes juntos; em caso de regressão, reverter a change na implementação sem conversão de dados.
