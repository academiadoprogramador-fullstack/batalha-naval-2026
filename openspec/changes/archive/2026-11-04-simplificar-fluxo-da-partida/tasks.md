# Tasks

## 1. Entrada direta e início do combate

- [x] 1.1 Ajustar `src/app/app.ts` para iniciar em preparação com as duas frotas inicializadas, reutilizar o reset no reinício e remover as fases `apresentacao`/`pronta`; verificar com testes de componente que a abertura mostra cinco embarcações pendentes e a frota adversária permanece oculta.
- [x] 1.2 Substituir em `src/app/app.html` a tela inicial e a tela de prontidão por um botão “Iniciar combate” na preparação, com transição protegida por fase e prontidão; verificar com testes que ele permanece desabilitado até ambas as frotas estarem completas, não inicia automaticamente e, após um único clique, apresenta combate sem ataques com turno do jogador.
- [x] 1.3 Atualizar em `src/app/app.spec.ts` os testes de posicionamento e de reinício que acionam o primeiro botão ou esperam a fase `pronta`; verificar que `npm test -- --run` cobre reposicionamento antes do clique e um segundo combate independente.

## 2. Desfecho sobre os tabuleiros

- [x] 2.1 Posicionar em `src/app/app.html` o resultado e “Jogar novamente” em overlay único no container compartilhado dos tabuleiros, sem seção final abaixo do grid; verificar com testes de componente vitória e derrota, preservação das marcas, ausência de ataques disponíveis e retorno à preparação limpa.
- [x] 2.2 Ajustar o gerenciamento de foco ao exibir e remover o overlay, com apresentação legível em telas estreitas e sem depender apenas de cor; verificar com testes por teclado que o foco alcança “Jogar novamente”, a ativação reinicia a partida e o foco retorna a um ponto identificável da preparação.

## 3. Verificação integrada

- [x] 3.1 Executar `npm test -- --run`, `npm run lint` e `npm run build` e verificar que o fluxo completo preparação → combate → vitória/derrota → reinício permanece funcional e que não há regressões de compilação ou lint.
