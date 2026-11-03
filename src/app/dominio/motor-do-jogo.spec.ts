import {
  TAMANHOS_FROTA,
  calcularPosicoes,
  coordenadaValida,
  criarTabuleiro,
  frotaCompleta,
  gerarFrota,
  posicionarEmbarcacao,
  registrarAtaque,
  reposicionarEmbarcacao,
  type Coordenada,
} from './motor-do-jogo';

const coord = (linha: string, coluna: number) => ({ linha, coluna }) as Coordenada;

describe('motor do jogo', () => {
  it('define a composição da frota e aceita as bordas A1/J10', () => {
    expect(Object.values(TAMANHOS_FROTA)).toEqual([5, 4, 3, 3, 2]);
    expect(coordenadaValida(coord('A', 1))).toBe(true);
    expect(coordenadaValida(coord('J', 10))).toBe(true);
    expect(coordenadaValida(coord('K', 1))).toBe(false);
    expect(coordenadaValida(coord('A', 11))).toBe(false);
  });

  it('calcula posições consecutivas e rejeita coordenadas e bordas inválidas', () => {
    expect(calcularPosicoes(coord('B', 2), 'horizontal', 3)).toEqual({
      ok: true,
      valor: [coord('B', 2), coord('B', 3), coord('B', 4)],
    });
    expect(calcularPosicoes(coord('I', 10), 'vertical', 2)).toEqual({
      ok: true,
      valor: [coord('I', 10), coord('J', 10)],
    });
    expect(calcularPosicoes(coord('A', 8), 'horizontal', 5)).toEqual({ ok: false, erro: 'borda' });
    expect(calcularPosicoes(coord('K', 1), 'horizontal', 2)).toEqual({ ok: false, erro: 'coordenada-invalida' });
    expect(calcularPosicoes(coord('A', 1), 'diagonal', 2)).toEqual({ ok: false, erro: 'orientacao-invalida' });
  });

  it('detecta frota completa somente com os cinco tipos únicos', () => {
    let tabuleiro = criarTabuleiro();
    expect(frotaCompleta(tabuleiro)).toBe(false);
    for (const [tipo, coluna] of [
      ['porta-avioes', 1], ['encouracado', 1], ['cruzador', 1], ['submarino', 1], ['destroyer', 1],
    ] as const) {
      const posicionado = posicionarEmbarcacao(tabuleiro, tipo, coord(String.fromCharCode(65 + coluna - 1 + tabuleiro.embarcacoes.length), 1), 'horizontal');
      expect(posicionado.ok).toBe(true);
      if (posicionado.ok) tabuleiro = posicionado.valor;
    }
    expect(frotaCompleta(tabuleiro)).toBe(true);
    expect(frotaCompleta({ ...tabuleiro, embarcacoes: [...tabuleiro.embarcacoes, tabuleiro.embarcacoes[0]!] })).toBe(false);
  });

  it('posiciona sem sobreposição, aceita adjacência e reposiciona atomicamente', () => {
    const inicial = posicionarEmbarcacao(criarTabuleiro(), 'destroyer', coord('A', 1), 'horizontal');
    expect(inicial.ok).toBe(true);
    if (!inicial.ok) return;
    const adjacente = posicionarEmbarcacao(inicial.valor, 'submarino', coord('A', 3), 'horizontal');
    expect(adjacente.ok).toBe(true);
    if (!adjacente.ok) return;
    const falha = posicionarEmbarcacao(adjacente.valor, 'cruzador', coord('A', 2), 'horizontal');
    expect(falha).toEqual({ ok: false, erro: 'sobreposicao' });
    const mudou = reposicionarEmbarcacao(adjacente.valor, 'destroyer', coord('J', 10), 'horizontal');
    expect(mudou).toEqual({ ok: false, erro: 'borda' });
    expect(adjacente.valor.embarcacoes[0]?.origem).toEqual(coord('A', 1));
    const movida = reposicionarEmbarcacao(adjacente.valor, 'destroyer', coord('B', 1), 'horizontal');
    expect(movida.ok).toBe(true);
    if (movida.ok) expect(movida.valor.embarcacoes.find((e) => e.tipo === 'destroyer')?.origem).toEqual(coord('B', 1));
  });

  it('gera frotas completas, válidas e dependentes da fonte aleatória', () => {
    const a = gerarFrota(() => 0);
    const b = gerarFrota(() => 0.73);
    expect(frotaCompleta(a)).toBe(true);
    expect(frotaCompleta(b)).toBe(true);
    expect(a.embarcacoes).not.toEqual(b.embarcacoes);
    for (const tabuleiro of [a, b]) {
      const ocupadas = tabuleiro.embarcacoes.flatMap((embarcacao) =>
        calcularPosicoes(embarcacao.origem, embarcacao.orientacao, TAMANHOS_FROTA[embarcacao.tipo]).ok
          ? (calcularPosicoes(embarcacao.origem, embarcacao.orientacao, TAMANHOS_FROTA[embarcacao.tipo]) as { ok: true; valor: Coordenada[] }).valor
          : [],
      );
      expect(new Set(ocupadas.map((p) => `${p.linha}${p.coluna}`)).size).toBe(17);
    }
  });

  it('termina em número finito de escolhas para várias fontes controladas', () => {
    for (let semente = 0; semente < 12; semente++) {
      let chamadas = 0;
      let estado = semente + 1;
      const gerada = gerarFrota(() => {
        chamadas++;
        estado = (estado * 16807) % 2147483647;
        return estado / 2147483647;
      });
      expect(chamadas).toBeLessThan(20000);
      expect(frotaCompleta(gerada)).toBe(true);
      const chaves = gerada.embarcacoes.flatMap((embarcacao) => {
        const resultado = calcularPosicoes(embarcacao.origem, embarcacao.orientacao, TAMANHOS_FROTA[embarcacao.tipo]);
        return resultado.ok ? resultado.valor.map((p) => `${p.linha}${p.coluna}`) : [];
      });
      expect(new Set(chaves).size).toBe(17);
    }
  });

  it('registra ataques, rejeita inválidos e reconhece destruição sem expor posições restantes', () => {
    const colocado = posicionarEmbarcacao(criarTabuleiro(), 'destroyer', coord('A', 1), 'horizontal');
    expect(colocado.ok).toBe(true);
    if (!colocado.ok) return;
    const primeiro = registrarAtaque(colocado.valor, coord('A', 1));
    expect(primeiro.ok).toBe(true);
    if (!primeiro.ok) return;
    expect(primeiro.valor.resultado).toEqual({ tipo: 'acerto', coordenada: coord('A', 1) });
    expect(Object.keys(primeiro.valor.resultado).sort()).toEqual(['coordenada', 'tipo']);
    expect(registrarAtaque(primeiro.valor.tabuleiro, coord('A', 1))).toEqual({ ok: false, erro: 'ataque-repetido' });
    expect(registrarAtaque(primeiro.valor.tabuleiro, coord('Z', 99))).toEqual({ ok: false, erro: 'coordenada-invalida' });
    expect(primeiro.valor.tabuleiro.ataques).toEqual([coord('A', 1)]);
    const segundo = registrarAtaque(primeiro.valor.tabuleiro, coord('A', 2));
    expect(segundo.ok && segundo.valor.resultado).toEqual({ tipo: 'destruida', coordenada: coord('A', 2), embarcacao: 'destroyer' });
    expect(segundo.ok && segundo.valor.frotaDestruida).toBe(false);
  });

  it('só declara a frota destruída quando a frota completa é eliminada', () => {
    let tabuleiro = criarTabuleiro();
    const embarcacoes = [
      ['porta-avioes', 'A', 1], ['encouracado', 'B', 1], ['cruzador', 'C', 1], ['submarino', 'D', 1], ['destroyer', 'E', 1],
    ] as const;
    for (const [tipo, linha, coluna] of embarcacoes) {
      const resultado = posicionarEmbarcacao(tabuleiro, tipo, coord(linha, coluna), 'horizontal');
      if (resultado.ok) tabuleiro = resultado.valor;
    }
    expect(frotaCompleta(tabuleiro)).toBe(true);
    const todas = tabuleiro.embarcacoes.flatMap((embarcacao) => {
      const calculadas = calcularPosicoes(embarcacao.origem, embarcacao.orientacao, TAMANHOS_FROTA[embarcacao.tipo]);
      return calculadas.ok ? calculadas.valor : [];
    });
    for (let indice = 0; indice < todas.length; indice++) {
      const ataque = registrarAtaque(tabuleiro, todas[indice]);
      expect(ataque.ok).toBe(true);
      if (ataque.ok) tabuleiro = ataque.valor.tabuleiro;
      if (indice < todas.length - 1 && ataque.ok) expect(ataque.valor.frotaDestruida).toBe(false);
      if (indice === todas.length - 1 && ataque.ok) expect(ataque.valor.frotaDestruida).toBe(true);
    }
  });
});
