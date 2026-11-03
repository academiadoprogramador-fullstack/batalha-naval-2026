# Design

## Context

Ver `proposal.md` — Why e `specs/motor-do-jogo/spec.md` — comportamento. O projeto contém um shell Angular e um único teste de fumaça; não há código de jogo em `src/app/dominio/`. A mudança arquivada de fundação reservou esse diretório para regras sem imports de Angular. O `README.md` fixa tabuleiro 10 × 10, frota de cinco embarcações, posicionamento sem sobreposição e resultado dos ataques.

## Goals / Non-Goals

**Goals:**

- Ter uma API de domínio reutilizável pela preparação e pela batalha, testável com Vitest sem montar componentes Angular.
- Representar estado e falhas de modo que uma tentativa inválida não consuma nem corrompa o estado anterior.
- Permitir geração aleatória reproduzível em testes, sem risco de laço infinito na distribuição da frota.

**Non-Goals:**

- Manter sinais, serviços de estado, fase da partida ou turno dentro do motor.
- Decidir o que revelar em cada tabuleiro da interface; o domínio fornece dados, enquanto a apresentação controla o sigilo da frota adversária.
- Persistir estado, introduzir dependências de execução ou implementar seleção de alvos do computador.

## Decisions

### 1. Modelo de domínio independente de Angular

Em `src/app/dominio/`, definir valores de coordenada (linha A–J, coluna 1–10), orientação, tipo/tamanho da embarcação, frota posicionada e ataques recebidos. As coordenadas ocupadas derivam da origem, orientação e tamanho de cada embarcação, evitando duas fontes de verdade. Manter a composição fixa da frota em uma única definição; verificar completude pelos cinco tipos posicionados, não apenas por contagem de posições. Arquivos e símbolos novos seguem a convenção de nomes em português.

**Alternativas:** modelar tudo no componente (mistura regras e apresentação); armazenar simultaneamente posição inicial e lista editável de células ocupadas (favorece divergência).

### 2. Operações puras e reposicionamento atômico

Operações de posicionar e atacar recebem um estado e devolvem um novo estado com resultado, ou uma falha explícita com motivo e o estado original preservado. Ao reposicionar, validar a proposta contra as **outras** embarcações antes de substituir a posição anterior; a própria posição antiga não conta como conflito. O resultado de validação distingue pelo menos coordenada/orientação inválida, borda e sobreposição para permitir feedback na futura tela de preparação. Coordenadas também são verificadas em tempo de execução, não apenas por tipos TypeScript.

**Alternativas:** mutar o tabuleiro e desfazer erros (propenso a estado parcial); lançar exceções para tentativas normais do usuário (torna a integração da UI mais difícil).

### 3. Geração automática a partir das mesmas regras

Enumerar posições válidas para cada tamanho e orientação e sortear a ordem de candidatas com uma fonte de aleatoriedade injetável; usar busca com retrocesso se uma escolha impedir completar a frota. Reutilizar a mesma validação de sobreposição e borda da colocação manual. A injeção da aleatoriedade permite testes determinísticos; a busca finita impede repetição indefinida. A aleatoriedade não implica distribuição estatisticamente uniforme entre todos os tabuleiros possíveis, o que não é exigido.

**Alternativas:** tentar coordenadas aleatórias indefinidamente (pode não terminar); distribuir modelos fixos (não oferece variação entre partidas); implementar um gerador uniforme exaustivo (complexidade sem ganho para o enunciado).

### 4. Ataques e apuração em um tabuleiro-alvo

Cada tabuleiro registra coordenadas atacadas, independentemente de quem realizou o ataque. Um ataque válido registra apenas a coordenada selecionada, identifica água ou a embarcação atingida e informa destruição quando todas as posições dessa embarcação já foram atacadas. A resposta do ataque contém somente coordenada, tipo do resultado e, quando destruída, identidade da embarcação; não entrega as posições intactas. O estado completo da frota permanece reservado à lógica do jogo: a futura camada de apresentação terá de projetar visões distintas para os tabuleiros do jogador e do computador. A apuração de frota destruída exige frota completa, evitando vitória acidental durante a preparação.

**Alternativas:** marcar acertos em cada embarcação e também no histórico (duas fontes de verdade); colocar alternância de turnos e vitória/derrota no tabuleiro (acopla regras locais à sessão de partida).

## Risks / Trade-offs

- **A futura UI expor por engano posições do computador ao ler o estado completo** → manter resultado público do ataque enxuto e especificar a projeção de visibilidade na change da batalha; não renderizar diretamente a frota adversária.
- **Busca aleatória mal implementada travar ou produzir distribuições inválidas** → percorrer conjunto finito de candidatas, validar cada colocação e testar muitas gerações com fonte de aleatoriedade controlada.
- **API de domínio crescer além do necessário nesta fase** → expor operações pequenas e testar somente contratos presentes na spec; deixar fase e turnos para mudanças próprias.

## Migration Plan

Não há dados nem API de jogo existentes para migrar. Adicionar módulos e testes de domínio sem mudar o shell; rollback consiste em retirar apenas os módulos dessa change, antes de serem consumidos pelas fases seguintes.
