export type Linha = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J';
export type Orientacao = 'horizontal' | 'vertical';
export type TipoEmbarcacao =
  | 'porta-avioes'
  | 'encouracado'
  | 'cruzador'
  | 'submarino'
  | 'destroyer';

export interface Coordenada {
  linha: Linha;
  coluna: number;
}

export interface Posicionamento {
  tipo: TipoEmbarcacao;
  origem: Coordenada;
  orientacao: Orientacao;
}

export interface Tabuleiro {
  embarcacoes: readonly Posicionamento[];
  ataques: readonly Coordenada[];
}

export const TAMANHOS_FROTA: Readonly<Record<TipoEmbarcacao, number>> = {
  'porta-avioes': 5,
  encouracado: 4,
  cruzador: 3,
  submarino: 3,
  destroyer: 2,
};

export const LINHAS: readonly Linha[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const TIPOS_EMBARCACAO = Object.keys(TAMANHOS_FROTA) as TipoEmbarcacao[];

export function criarTabuleiro(): Tabuleiro {
  return { embarcacoes: [], ataques: [] };
}

export function coordenadaValida(valor: unknown): valor is Coordenada {
  if (typeof valor !== 'object' || valor === null) return false;
  const coordenada = valor as Partial<Coordenada>;
  return (
    LINHAS.includes(coordenada.linha as Linha) &&
    Number.isInteger(coordenada.coluna) &&
    (coordenada.coluna ?? 0) >= 1 &&
    (coordenada.coluna ?? 0) <= 10
  );
}

export function coordenadaParaTexto(coordenada: Coordenada): string {
  return `${coordenada.linha}${coordenada.coluna}`;
}

export type ErroPosicionamento = 'coordenada-invalida' | 'orientacao-invalida' | 'borda' | 'sobreposicao' | 'tipo-invalido';
export type Resultado<T, E> = { ok: true; valor: T } | { ok: false; erro: E };

export function calcularPosicoes(
  origem: unknown,
  orientacao: unknown,
  tamanho: number,
): Resultado<Coordenada[], ErroPosicionamento> {
  if (!coordenadaValida(origem)) return { ok: false, erro: 'coordenada-invalida' };
  if (orientacao !== 'horizontal' && orientacao !== 'vertical') {
    return { ok: false, erro: 'orientacao-invalida' };
  }
  if (!Number.isInteger(tamanho) || tamanho < 1) return { ok: false, erro: 'tipo-invalido' };
  const indiceLinha = LINHAS.indexOf(origem.linha);
  const ultimaLinha = indiceLinha + (orientacao === 'vertical' ? tamanho - 1 : 0);
  const ultimaColuna = origem.coluna + (orientacao === 'horizontal' ? tamanho - 1 : 0);
  if (ultimaLinha > 9 || ultimaColuna > 10) return { ok: false, erro: 'borda' };
  return {
    ok: true,
    valor: Array.from({ length: tamanho }, (_, indice) => ({
      linha: LINHAS[indiceLinha + (orientacao === 'vertical' ? indice : 0)]!,
      coluna: origem.coluna + (orientacao === 'horizontal' ? indice : 0),
    })),
  };
}

function posicoesEmbarcacao(embarcacao: Posicionamento): Coordenada[] {
  const resultado = calcularPosicoes(embarcacao.origem, embarcacao.orientacao, TAMANHOS_FROTA[embarcacao.tipo]);
  return resultado.ok ? resultado.valor : [];
}

function chavesPosicoes(posicoes: readonly Coordenada[]): Set<string> {
  return new Set(posicoes.map(coordenadaParaTexto));
}

export function frotaCompleta(tabuleiro: Tabuleiro): boolean {
  return (
    tabuleiro.embarcacoes.length === TIPOS_EMBARCACAO.length &&
    TIPOS_EMBARCACAO.every((tipo) => tabuleiro.embarcacoes.filter((embarcacao) => embarcacao.tipo === tipo).length === 1)
  );
}

export function posicionarEmbarcacao(
  tabuleiro: Tabuleiro,
  tipo: TipoEmbarcacao,
  origem: unknown,
  orientacao: unknown,
): Resultado<Tabuleiro, ErroPosicionamento> {
  if (!TIPOS_EMBARCACAO.includes(tipo)) return { ok: false, erro: 'tipo-invalido' };
  const calculadas = calcularPosicoes(origem, orientacao, TAMANHOS_FROTA[tipo]);
  if (!calculadas.ok) return calculadas;
  if (tabuleiro.embarcacoes.some((embarcacao) => embarcacao.tipo === tipo)) {
    return reposicionarEmbarcacao(tabuleiro, tipo, origem, orientacao);
  }
  const ocupadas = chavesPosicoes(tabuleiro.embarcacoes.flatMap(posicoesEmbarcacao));
  if (calculadas.valor.some((posicao) => ocupadas.has(coordenadaParaTexto(posicao)))) {
    return { ok: false, erro: 'sobreposicao' };
  }
  return {
    ok: true,
    valor: { ...tabuleiro, embarcacoes: [...tabuleiro.embarcacoes, { tipo, origem: { ...(origem as Coordenada) }, orientacao: orientacao as Orientacao }] },
  };
}

export function reposicionarEmbarcacao(
  tabuleiro: Tabuleiro,
  tipo: TipoEmbarcacao,
  origem: unknown,
  orientacao: unknown,
): Resultado<Tabuleiro, ErroPosicionamento> {
  if (!TIPOS_EMBARCACAO.includes(tipo)) return { ok: false, erro: 'tipo-invalido' };
  const calculadas = calcularPosicoes(origem, orientacao, TAMANHOS_FROTA[tipo]);
  if (!calculadas.ok) return calculadas;
  const outras = tabuleiro.embarcacoes.filter((embarcacao) => embarcacao.tipo !== tipo);
  const ocupadas = chavesPosicoes(outras.flatMap(posicoesEmbarcacao));
  if (calculadas.valor.some((posicao) => ocupadas.has(coordenadaParaTexto(posicao)))) {
    return { ok: false, erro: 'sobreposicao' };
  }
  const nova: Posicionamento = { tipo, origem: { ...(origem as Coordenada) }, orientacao: orientacao as Orientacao };
  return { ok: true, valor: { ...tabuleiro, embarcacoes: [...outras, nova] } };
}

export function gerarFrota(aleatorio: () => number = Math.random): Tabuleiro {
  const candidatas = TIPOS_EMBARCACAO.map((tipo) => {
    const disponiveis: Posicionamento[] = [];
    for (const linha of LINHAS) {
      for (let coluna = 1; coluna <= 10; coluna++) {
        for (const orientacao of ['horizontal', 'vertical'] as const) {
          if (calcularPosicoes({ linha, coluna }, orientacao, TAMANHOS_FROTA[tipo]).ok) {
            disponiveis.push({ tipo, origem: { linha, coluna }, orientacao });
          }
        }
      }
    }
    return disponiveis;
  });

  const tentar = (indice: number, tabuleiro: Tabuleiro): Tabuleiro | undefined => {
    if (indice === TIPOS_EMBARCACAO.length) return tabuleiro;
    const candidatos = [...candidatas[indice]!];
    for (let i = candidatos.length - 1; i > 0; i--) {
      const sorteado = Math.floor(Math.max(0, Math.min(0.999999999, aleatorio())) * (i + 1));
      [candidatos[i], candidatos[sorteado]] = [candidatos[sorteado]!, candidatos[i]!];
    }
    for (const candidata of candidatos) {
      const resultado = posicionarEmbarcacao(tabuleiro, candidata.tipo, candidata.origem, candidata.orientacao);
      if (resultado.ok) {
        const completa = tentar(indice + 1, resultado.valor);
        if (completa) return completa;
      }
    }
    return undefined;
  };

  return tentar(0, criarTabuleiro()) ?? criarTabuleiro();
}

export type ResultadoAtaque =
  | { tipo: 'agua'; coordenada: Coordenada }
  | { tipo: 'acerto'; coordenada: Coordenada }
  | { tipo: 'destruida'; coordenada: Coordenada; embarcacao: TipoEmbarcacao };
export type ErroAtaque = 'coordenada-invalida' | 'ataque-repetido';

export function registrarAtaque(
  tabuleiro: Tabuleiro,
  coordenada: unknown,
): Resultado<{ tabuleiro: Tabuleiro; resultado: ResultadoAtaque; frotaDestruida: boolean }, ErroAtaque> {
  if (!coordenadaValida(coordenada)) return { ok: false, erro: 'coordenada-invalida' };
  const chave = coordenadaParaTexto(coordenada);
  if (tabuleiro.ataques.some((ataque) => coordenadaParaTexto(ataque) === chave)) {
    return { ok: false, erro: 'ataque-repetido' };
  }
  const ataques = [...tabuleiro.ataques, { ...coordenada }];
  const atingida = tabuleiro.embarcacoes.find((embarcacao) =>
    posicoesEmbarcacao(embarcacao).some((posicao) => coordenadaParaTexto(posicao) === chave),
  );
  let resultado: ResultadoAtaque = { tipo: 'agua', coordenada: { ...coordenada } };
  if (atingida) {
    const posicoes = posicoesEmbarcacao(atingida);
    const destruiu = posicoes.every((posicao) => ataques.some((ataque) => coordenadaParaTexto(ataque) === coordenadaParaTexto(posicao)));
    resultado = destruiu
      ? { tipo: 'destruida', coordenada: { ...coordenada }, embarcacao: atingida.tipo }
      : { tipo: 'acerto', coordenada: { ...coordenada } };
  }
  const novoTabuleiro = { ...tabuleiro, ataques };
  const frotaDestruida = frotaCompleta(novoTabuleiro) && novoTabuleiro.embarcacoes.every((embarcacao) =>
    posicoesEmbarcacao(embarcacao).every((posicao) => ataques.some((ataque) => coordenadaParaTexto(ataque) === coordenadaParaTexto(posicao))),
  );
  return { ok: true, valor: { tabuleiro: novoTabuleiro, resultado, frotaDestruida } };
}
