import { LINHAS, coordenadaParaTexto, type Coordenada } from './motor-do-jogo';

/** Escolhe uniformemente entre casas ainda não atacadas, sem consultar a frota. */
export function escolherAlvoDisponivel(
  ataques: readonly Coordenada[],
  aleatorio: () => number = Math.random,
): Coordenada | undefined {
  const atacadas = new Set(ataques.map(coordenadaParaTexto));
  const disponiveis = LINHAS.flatMap((linha) =>
    Array.from({ length: 10 }, (_, indice) => ({ linha, coluna: indice + 1 } as Coordenada)),
  ).filter((coordenada) => !atacadas.has(coordenadaParaTexto(coordenada)));
  if (disponiveis.length === 0) return undefined;
  const sorteio = Math.max(0, Math.min(0.999999999, aleatorio()));
  return disponiveis[Math.floor(sorteio * disponiveis.length)];
}
