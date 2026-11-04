import { afterRenderEffect, Component, computed, ElementRef, signal, viewChild } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import {
  LINHAS,
  TAMANHOS_FROTA,
  calcularPosicoes,
  criarTabuleiro,
  frotaCompleta,
  gerarFrota,
  posicionarEmbarcacao,
  registrarAtaque,
  coordenadaParaTexto,
  type Coordenada,
  type Orientacao,
  type Tabuleiro,
  type TipoEmbarcacao,
  type ResultadoAtaque,
} from './dominio/motor-do-jogo';
import { escolherAlvoDisponivel } from './dominio/conduzir-combate';
import { TabuleiroCombate, type CasaCombate } from './componentes/tabuleiro-combate';

const NOMES_EMBARCACAO: Readonly<Record<TipoEmbarcacao, string>> = {
  'porta-avioes': 'Porta-aviões',
  encouracado: 'Encouraçado',
  cruzador: 'Cruzador',
  submarino: 'Submarino',
  destroyer: 'Destroyer',
};

const TIPOS_EMBARCACAO = Object.keys(TAMANHOS_FROTA) as TipoEmbarcacao[];
const CORES_EMBARCACAO: Readonly<Record<TipoEmbarcacao, string>> = {
  'porta-avioes': '#fecaca',
  encouracado: '#fed7aa',
  cruzador: '#fef08a',
  submarino: '#bbf7d0',
  destroyer: '#bfdbfe',
};

@Component({
  imports: [LucideShip, TabuleiroCombate],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly tituloPreparacao = viewChild<ElementRef<HTMLElement>>('tituloPreparacao');
  private readonly botaoReiniciar = viewChild<ElementRef<HTMLButtonElement>>('botaoReiniciar');
  protected readonly nomeJogo = signal('Batalha Naval');
  protected readonly fase = signal<'preparacao' | 'combate' | 'encerrada'>('preparacao');
  protected readonly turno = signal<'jogador' | 'computador'>('jogador');
  protected fonteAleatoria: () => number = Math.random;
  protected readonly linhas = LINHAS;
  protected readonly colunas = Array.from({ length: 10 }, (_, indice) => indice + 1);
  protected readonly embarcacoes = TIPOS_EMBARCACAO.map((tipo) => ({
    tipo,
    nome: NOMES_EMBARCACAO[tipo],
    tamanho: TAMANHOS_FROTA[tipo],
  }));
  protected readonly coresEmbarcacao = CORES_EMBARCACAO;
  protected readonly tabuleiroJogador = signal<Tabuleiro>(criarTabuleiro());
  protected readonly tabuleiroComputador = signal<Tabuleiro | null>(gerarFrota());
  protected readonly tipoSelecionado = signal<TipoEmbarcacao>('porta-avioes');
  protected readonly orientacao = signal<Orientacao>('horizontal');
  protected readonly mensagem = signal('Escolha uma embarcação e uma casa para posicioná-la.');
  protected readonly resultadosComputador = signal<readonly ResultadoAtaque[]>([]);
  protected readonly resultadosJogador = signal<readonly ResultadoAtaque[]>([]);
  protected readonly desfecho = signal<'vitoria' | 'derrota' | null>(null);
  protected readonly frotaJogadorCompleta = computed(() => frotaCompleta(this.tabuleiroJogador()));
  protected readonly frotaComputadorCompleta = computed(() => {
    const tabuleiro = this.tabuleiroComputador();
    return tabuleiro !== null && frotaCompleta(tabuleiro);
  });
  protected readonly podeAvancar = computed(() => this.frotaJogadorCompleta() && this.frotaComputadorCompleta());
  protected readonly visaoJogador = computed((): CasaCombate[] => this.linhas.flatMap((linha) => this.colunas.map((coluna) => {
    const coordenada = { linha, coluna } as Coordenada;
    const resultado = this.resultadoJogador(linha, coluna);
    const ocupada = this.casaOcupada(linha, coluna);
    const estado = resultado?.tipo === 'agua' ? 'agua' : resultado?.tipo === 'destruida' ? 'destruida' : resultado ? 'acerto' : ocupada ? 'embarcacao' : 'oculta';
    return { coordenada, estado, descricao: this.nomeResultado(resultado) } as CasaCombate;
  })));
  protected readonly visaoComputador = computed((): CasaCombate[] => this.linhas.flatMap((linha) => this.colunas.map((coluna) => {
    const resultado = this.resultadoComputador(linha, coluna);
    const estado = resultado?.tipo === 'agua' ? 'agua' : resultado?.tipo === 'destruida' ? 'destruida' : resultado ? 'acerto' : 'oculta';
    return { coordenada: { linha, coluna } as Coordenada, estado, descricao: this.nomeResultado(resultado) } as CasaCombate;
  })));

  constructor() {
    let faseAnterior = this.fase();
    afterRenderEffect(() => {
      const faseAtual = this.fase();
      if (faseAtual === faseAnterior) return;
      faseAnterior = faseAtual;
      const elemento = faseAtual === 'encerrada'
        ? this.botaoReiniciar()?.nativeElement
        : faseAtual === 'preparacao' ? this.tituloPreparacao()?.nativeElement : undefined;
      elemento?.focus();
    });
  }

  protected iniciarPreparacao(): void {
    this.tabuleiroJogador.set(criarTabuleiro());
    this.tabuleiroComputador.set(gerarFrota());
    this.resultadosJogador.set([]);
    this.resultadosComputador.set([]);
    this.desfecho.set(null);
    this.turno.set('jogador');
    this.tipoSelecionado.set('porta-avioes');
    this.orientacao.set('horizontal');
    this.mensagem.set('Escolha uma embarcação e uma casa para posicioná-la.');
    this.fase.set('preparacao');
  }

  protected selecionarEmbarcacao(tipo: TipoEmbarcacao): void {
    this.tipoSelecionado.set(tipo);
    this.mensagem.set(`${NOMES_EMBARCACAO[tipo]} selecionado. Escolha uma casa de origem.`);
  }

  protected selecionarOrientacao(orientacao: Orientacao): void {
    this.orientacao.set(orientacao);
    this.mensagem.set(`Orientação ${orientacao} selecionada.`);
  }

  protected posicionar(linha: string, coluna: number): void {
    const resultado = posicionarEmbarcacao(
      this.tabuleiroJogador(),
      this.tipoSelecionado(),
      { linha, coluna } as Coordenada,
      this.orientacao(),
    );
    if (!resultado.ok) {
      const erros: Record<typeof resultado.erro, string> = {
        borda: 'A embarcação não cabe no tabuleiro nessa posição.',
        sobreposicao: 'Essa posição ocupa casas de outra embarcação.',
        'coordenada-invalida': 'A casa escolhida não é válida.',
        'orientacao-invalida': 'A orientação escolhida não é válida.',
        'tipo-invalido': 'A embarcação escolhida não é válida.',
      };
      this.mensagem.set(erros[resultado.erro]);
      return;
    }
    this.tabuleiroJogador.set(resultado.valor);
    this.mensagem.set(`${NOMES_EMBARCACAO[this.tipoSelecionado()]} posicionada em ${linha}${coluna}.`);
  }

  protected casaOcupada(linha: string, coluna: number): boolean {
    return this.tabuleiroJogador().embarcacoes.some((embarcacao) => {
      const posicoes = calcularPosicoes(embarcacao.origem, embarcacao.orientacao, TAMANHOS_FROTA[embarcacao.tipo]);
      return posicoes.ok && posicoes.valor.some((posicao) => posicao.linha === linha && posicao.coluna === coluna);
    });
  }

  protected iniciarCombate(): void {
    if (this.fase() !== 'preparacao' || !this.podeAvancar()) return;
    this.turno.set('jogador');
    this.mensagem.set('Combate iniciado. É a vez do jogador.');
    this.fase.set('combate');
  }

  protected atacarComputador(linha: string, coluna: number): void {
    if (this.fase() !== 'combate' || this.turno() !== 'jogador') return;
    const coordenada = { linha, coluna } as Coordenada;
    const ataque = registrarAtaque(this.tabuleiroComputador()!, coordenada);
    if (!ataque.ok) {
      this.mensagem.set(ataque.erro === 'ataque-repetido'
        ? `Tentativa recusada: ${coordenadaParaTexto(coordenada)} já foi atacada. É a vez do jogador.`
        : 'Tentativa recusada: coordenada inválida.');
      return;
    }
    this.tabuleiroComputador.set(ataque.valor.tabuleiro);
    this.resultadosComputador.update((resultados) => [...resultados, ataque.valor.resultado]);
    const textoJogador = this.textoResultado('Você', ataque.valor.resultado);
    if (ataque.valor.frotaDestruida) {
      this.desfecho.set('vitoria');
      this.fase.set('encerrada');
      this.mensagem.set(`${textoJogador} Combate encerrado: a frota do computador foi destruída.`);
      return;
    }

    this.turno.set('computador');
    const alvo = escolherAlvoDisponivel(this.tabuleiroJogador().ataques, this.fonteAleatoria);
    if (!alvo) {
      this.fase.set('encerrada');
      this.mensagem.set(`${textoJogador} Combate encerrado.`);
      return;
    }
    const resposta = registrarAtaque(this.tabuleiroJogador(), alvo);
    if (!resposta.ok) return;
    this.tabuleiroJogador.set(resposta.valor.tabuleiro);
    this.resultadosJogador.update((resultados) => [...resultados, resposta.valor.resultado]);
    const textoComputador = this.textoResultado('O computador', resposta.valor.resultado);
    if (resposta.valor.frotaDestruida) {
      this.desfecho.set('derrota');
      this.fase.set('encerrada');
      this.mensagem.set(`${textoJogador} ${textoComputador} Combate encerrado: sua frota foi destruída.`);
      return;
    }
    this.turno.set('jogador');
    this.mensagem.set(`${textoJogador} ${textoComputador} É a vez do jogador.`);
  }

  protected resultadoComputador(linha: string, coluna: number): ResultadoAtaque | undefined {
    return this.resultadosComputador().find((r) => r.coordenada.linha === linha && r.coordenada.coluna === coluna);
  }

  protected resultadoJogador(linha: string, coluna: number): ResultadoAtaque | undefined {
    return this.resultadosJogador().find((r) => r.coordenada.linha === linha && r.coordenada.coluna === coluna);
  }

  protected nomeResultado(resultado: ResultadoAtaque | undefined): string {
    if (!resultado) return 'não atacada';
    return resultado.tipo === 'agua' ? 'água recebida' : resultado.tipo === 'acerto' ? 'acerto recebido' : `destruiu ${NOMES_EMBARCACAO[resultado.embarcacao]}`;
  }

  private textoResultado(origem: string, resultado: ResultadoAtaque): string {
    return `${origem}: ${coordenadaParaTexto(resultado.coordenada)}, ${resultado.tipo === 'destruida' ? `embarcação destruída: ${NOMES_EMBARCACAO[resultado.embarcacao]}` : this.nomeResultado(resultado)}.`;
  }
}
