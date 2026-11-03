import { escolherAlvoDisponivel } from './conduzir-combate';
import type { Coordenada } from './motor-do-jogo';

describe('escolherAlvoDisponivel', () => {
  it('escolhe deterministicamente apenas casas ainda não atacadas', () => {
    const ataques: Coordenada[] = [{ linha: 'A', coluna: 1 }, { linha: 'A', coluna: 2 }];
    expect(escolherAlvoDisponivel(ataques, () => 0)).toEqual({ linha: 'A', coluna: 3 });
    expect(escolherAlvoDisponivel(ataques, () => 0.999999)).toEqual({ linha: 'J', coluna: 10 });
  });

  it('retorna indefinido quando todas as casas já foram atacadas', () => {
    const ataques = Array.from({ length: 100 }, (_, indice) => ({
      linha: String.fromCharCode(65 + Math.floor(indice / 10)) as Coordenada['linha'],
      coluna: (indice % 10) + 1,
    }));
    expect(escolherAlvoDisponivel(ataques, () => 0)).toBeUndefined();
  });
});
