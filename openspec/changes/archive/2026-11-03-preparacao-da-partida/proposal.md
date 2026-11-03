# Proposal

## Why

O motor de regras já permite montar frotas, mas a aplicação ainda mostra apenas um cabeçalho: não há como iniciar a preparação ou posicionar as embarcações. Esta change entrega a experiência de preparação utilizável antes de acrescentar turnos e ataques em uma change posterior.

## What Changes

- Apresentar uma entrada para iniciar a preparação da partida, sem iniciar ataques.
- Mostrar tabuleiro 10 × 10 e lista das cinco embarcações com tamanho e estado de posicionamento.
- Permitir selecionar embarcação e orientação e tocar/clicar em uma casa para posicionar ou reposicionar; oferecer os mesmos controles por teclado.
- Exibir erros de borda ou sobreposição sem apagar posicionamentos válidos e permitir embarcações adjacentes.
- Gerar a frota do computador sem revelar sua disposição e habilitar a ação de avançar ao combate somente quando ambas as frotas estiverem completas.

**Fora do escopo:** ataques, turnos, tabuleiro de batalha do computador, resultado de vitória/derrota e reinício depois do combate; ficam para changes posteriores. Nesta fase, a ação de avançar apenas registra a transição para o estado de preparação concluída, sem apresentar uma batalha jogável.

## Capabilities

### New Capabilities

- `preparacao-da-partida`: fluxo de entrada e preparação manual de frotas, feedback de posicionamento e prontidão para o combate.

### Modified Capabilities

Nenhuma. A capability `motor-do-jogo` mantém as regras existentes; esta change as utiliza na interface.

## Impact

- Integração do shell Angular em `src/app/` com as operações existentes de `src/app/dominio/motor-do-jogo.ts` e testes de interface/fluxo.
- Interface em português, responsiva e operável por toque, mouse e teclado, com estilos Tailwind CSS e ícones Lucide onde úteis.
- Sem nova dependência de execução, API externa ou persistência; o estado dura somente enquanto a aplicação está aberta.
