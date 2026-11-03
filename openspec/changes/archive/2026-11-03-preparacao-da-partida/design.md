# Design

## Context

Ver `proposal.md` — Why e `specs/preparacao-da-partida/spec.md` — comportamento. Hoje `src/app/app.ts` contém somente o nome do jogo, `src/app/app.html` tem `<main>` vazio e `src/app/app.spec.ts` verifica o shell. O domínio puro em `src/app/dominio/motor-do-jogo.ts` oferece `criarTabuleiro`, `posicionarEmbarcacao`, `reposicionarEmbarcacao`, `gerarFrota`, `calcularPosicoes` e `frotaCompleta`. O tabuleiro do computador inclui posições secretas, portanto a apresentação não deve receber seu estado completo. A aplicação usa Angular standalone e zoneless.

## Goals / Non-Goals

**Goals:**

- Integrar as operações puras existentes sem replicar regras de colocação na interface.
- Preservar ambos os tabuleiros em estado de sessão para a futura change de batalha e impedir sua exposição indevida na preparação.
- Deixar a interface navegável e compreensível por teclado, mouse e toque em larguras pequenas.

**Non-Goals:**

- Criar serviço global, roteamento ou persistência para uma sessão que ainda vive em uma única tela.
- Reimplementar o motor, resolver ataques ou anunciar uma batalha jogável antes da change própria.

## Decisions

### 1. Estado de sessão mínimo no shell

O componente raiz orquestra sinais para fase (`apresentacao`, `preparacao`, `pronta`), tabuleiro do jogador, tabuleiro do computador, embarcação e orientação selecionadas e mensagem de feedback. Ao iniciar, cria um tabuleiro vazio para o jogador e gera a frota do computador, mantendo esta última somente no estado de orquestração. A prontidão é derivada de `frotaCompleta` para ambos, não de uma contagem manual ou de um botão habilitado por convenção. O avanço guarda os dois tabuleiros e exibe um estado de preparação concluída; não executa ataques nem apresenta uma interface de combate vazia como se fosse jogável.

**Alternativas:** serviço Angular para uma única tela (escopo prematuro); montar estado todo no DOM (dificulta testes e perda acidental da frota); mostrar o tabuleiro do computador na preparação (vaza posições secretas).

### 2. Interface de preparação por seleção e origem

Uma região/componente standalone de preparação apresenta lista de embarcações com nome, tamanho e estado, orientação horizontal/vertical, tabuleiro 10 × 10 com rótulos A–J/1–10 e ação de avançar. Cada casa acionável usa um controle nativo com nome acessível da coordenada; seleção e orientação também usam controles nativos. A apresentação deriva casas ocupadas dos posicionamentos via `calcularPosicoes`, sem criar outra fonte de verdade. O layout Tailwind adapta a lista e o tabuleiro às telas estreitas e oferece área de interação adequada ao toque, inclusive quando as 10 colunas exigirem rolagem horizontal da região do tabuleiro.

**Alternativas:** arrastar e soltar (demanda alternativa separada para teclado/toque); lista de 100 inputs de texto (pouco intuitiva); desenhar posição ocupada por flags mutáveis por casa (duplica estado do domínio).

### 3. Resultado explícito da operação como feedback

Ao acionar uma casa, a orquestração invoca `posicionarEmbarcacao` para a embarcação selecionada; esta operação já delega para o reposicionamento quando necessário, ignorando as casas antigas. Apenas em caso `ok` o sinal do tabuleiro do jogador é atualizado; falhas são traduzidas em mensagens em português (borda, sobreposição, coordenada/orientação/tipo inválido), preservando a seleção para tentar novamente. O feedback textual deve ser anunciado por uma região de status acessível, sem depender da cor; a lista identifica a embarcação selecionada e quais já estão posicionadas.

**Alternativas:** validar manualmente no componente (risco de divergência do motor); limpar a seleção após cada tentativa (dificulta corrigir falhas); ocultar erros por bloquear todas as casas possivelmente inválidas (não explica o motivo).

### 4. Fronteira para a batalha futura

O estado `pronta` mantém tabuleiros completos na orquestração, mas a tela de preparação concluída só comunica que estão prontos, sem renderizar células ou posições do computador. A próxima change poderá consumir a sessão e projetar duas visões distintas dos tabuleiros; não deve usar o tabuleiro secreto diretamente na interface adversária.

**Alternativas:** implementar a batalha parcialmente agora (ultrapassa a change); compartilhar o estado secreto com a região visual para calcular prontidão (desnecessário e arriscado).

## Risks / Trade-offs

- **Tabuleiro 10 × 10 apertado no celular** → região de tabuleiro com largura mínima e rolagem localizada, rótulos legíveis e testes de uso em viewport estreita.
- **Exposição da frota do computador por ligação acidental ao template** → componente de preparação recebe apenas dados do jogador e booleano de prontidão do computador; testes não encontram coordenadas secretas na tela.
- **Erro de borda/sobreposição apagar posições anteriores** → atualizar o sinal somente após `ok`, exercitando reposicionamento inválido em teste.
- **Botão de avançar aparentar partida jogável quando não há turnos** → rotular claramente o estado posterior como preparação concluída e deixar combate fora desta entrega.

## Migration Plan

Não há estado persistido nem API a migrar. Substituir a área principal vazia pelo fluxo de apresentação/preparação e manter o cabeçalho; revertê-lo consiste em retirar somente a camada de apresentação desta change, preservando o motor de domínio.
