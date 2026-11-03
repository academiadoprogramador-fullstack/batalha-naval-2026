# Proposal

## Why

A fundação Angular já existe, mas ainda não há regras de jogo implementadas nem uma especificação permanente para elas. Antes de construir a preparação e a batalha na interface, precisamos de um núcleo testável que represente tabuleiros, frotas e resultados de ataques conforme o `README.md`.

## What Changes

- Introduz regras puras para coordenadas de um tabuleiro 10 × 10 e para a composição fixa da frota de cada participante.
- Permite posicionar e reposicionar embarcações em linha reta, rejeitando bordas e sobreposições sem corromper posições válidas; permite embarcações encostadas.
- Gera automaticamente uma frota completa e válida para o computador.
- Resolve ataques a uma frota, distinguindo água, acerto e embarcação destruída; impede ataques repetidos ou fora do tabuleiro e identifica quando toda a frota foi destruída.
- Acrescenta testes unitários de domínio para regras e casos-limite.

**Fora do escopo:** telas e interação de posicionamento, exibição dos tabuleiros, turnos humano/computador, escolha de alvos pelo computador, anúncio visual de resultados, bloqueio da interface ao fim da partida e reinício da partida. Essas responsabilidades pertencem às mudanças posteriores de preparação, batalha e encerramento.

## Capabilities

### New Capabilities

- `motor-do-jogo`: regras de tabuleiro, composição e posicionamento de frotas, geração da frota do computador e resolução de ataques com apuração de destruição.

### Modified Capabilities

Nenhuma; ainda não há capabilities permanentes em `openspec/specs/`.

## Impact

- Novo código e testes de regras puras em `src/app/dominio/`, sem dependência de Angular nem alteração das telas existentes.
- Consumo futuro do motor pela preparação da frota e pelo fluxo da batalha; nenhuma API externa, persistência ou nova dependência de execução é prevista.
