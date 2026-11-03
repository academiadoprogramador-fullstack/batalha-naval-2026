# Tasks

## 1. Modelo de tabuleiro e frota

- [x] 1.1 Criar em `src/app/dominio/` os tipos de coordenada, orientação, embarcação e estado do tabuleiro, com a composição fixa da frota; verificar em testes unitários os cinco tipos, seus tamanhos e as bordas A1/J10.
- [x] 1.2 Implementar validação de coordenadas em tempo de execução e cálculo das posições consecutivas horizontal/vertical; verificar em testes os casos B2–B4, I10–J10 e rejeição de linhas/colunas inválidas e A8 horizontal para porta-aviões.
- [x] 1.3 Implementar consulta de completude da frota pelos cinco tipos posicionados; verificar em testes frota vazia, frota parcial e frota completa, sem aceitar duplicação de tipo.

## 2. Colocação manual e reposicionamento

- [x] 2.1 Implementar colocação validada, com resultado explícito de sucesso/falha sem mutação do estado anterior; verificar em testes aceitação de embarcações adjacentes e rejeição de borda e sobreposição mantendo as posições válidas.
- [x] 2.2 Implementar reposicionamento atômico de uma embarcação existente, ignorando suas posições antigas ao validar a substituição; verificar em testes movimento válido, falha por sobreposição/borda e preservação da posição anterior em caso de falha.

## 3. Distribuição da frota do computador

- [x] 3.1 Implementar geração automática com aleatoriedade injetável e conjunto finito de candidatas com retrocesso, reutilizando as regras de colocação; verificar em testes determinísticos que a frota sempre contém os cinco tipos sem bordas ultrapassadas nem sobreposições e que diferentes fontes podem produzir distribuições diferentes.
- [x] 3.2 Testar a geração repetida com fontes controladas, inclusive escolhas que exijam outras candidatas, e verificar que todas as execuções terminam com frota completa e válida sem laço de tentativas ilimitado.

## 4. Ataques e destruição

- [x] 4.1 Implementar registro de ataques e resultado explícito de água ou acerto, sem expor posições intactas na resposta; verificar em testes que somente a coordenada atacada é registrada e que um acerto parcial não marca outras posições.
- [x] 4.2 Implementar rejeição de ataque repetido ou fora do tabuleiro sem mutar o estado; verificar em testes preservação do histórico e do resultado anterior após ambas as tentativas inválidas.
- [x] 4.3 Implementar identificação da última posição atingida de uma embarcação e apuração da frota destruída somente quando completa; verificar em testes destruição da embarcação, última embarcação da frota e frota incompleta sem vitória.

## 5. Integração do domínio

- [x] 5.1 Executar `npm test`, `npm run lint` e `npm run build`; verificar que o shell continua funcional e que nenhum componente, serviço Angular ou fluxo de turnos foi acrescentado nesta change.
