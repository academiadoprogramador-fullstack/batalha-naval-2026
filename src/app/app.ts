import { Component, computed, signal } from '@angular/core';
import { LucideShip } from '@lucide/angular';
import {
  LINHAS,
  TAMANHOS_FROTA,
  calcularPosicoes,
  criarTabuleiro,
  frotaCompleta,
  gerarFrota,
  posicionarEmbarcacao,
  type Coordenada,
  type Orientacao,
  type Tabuleiro,
  type TipoEmbarcacao,
} from './dominio/motor-do-jogo';

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
  imports: [LucideShip],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly nomeJogo = signal('Batalha Naval');
  protected readonly fase = signal<'apresentacao' | 'preparacao' | 'pronta'>('apresentacao');
  protected readonly linhas = LINHAS;
  protected readonly colunas = Array.from({ length: 10 }, (_, indice) => indice + 1);
  protected readonly embarcacoes = TIPOS_EMBARCACAO.map((tipo) => ({
    tipo,
    nome: NOMES_EMBARCACAO[tipo],
    tamanho: TAMANHOS_FROTA[tipo],
  }));
  protected readonly coresEmbarcacao = CORES_EMBARCACAO;
  protected readonly tabuleiroJogador = signal<Tabuleiro>(criarTabuleiro());
  protected readonly tabuleiroComputador = signal<Tabuleiro | null>(null);
  protected readonly tipoSelecionado = signal<TipoEmbarcacao>('porta-avioes');
  protected readonly orientacao = signal<Orientacao>('horizontal');
  protected readonly mensagem = signal('Escolha uma embarcação e uma casa para posicioná-la.');
  protected readonly frotaJogadorCompleta = computed(() => frotaCompleta(this.tabuleiroJogador()));
  protected readonly frotaComputadorCompleta = computed(() => {
    const tabuleiro = this.tabuleiroComputador();
    return tabuleiro !== null && frotaCompleta(tabuleiro);
  });
  protected readonly podeAvancar = computed(() => this.frotaJogadorCompleta() && this.frotaComputadorCompleta());

  protected iniciarPreparacao(): void {
    this.tabuleiroJogador.set(criarTabuleiro());
    this.tabuleiroComputador.set(gerarFrota());
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

  protected avancar(): void {
    if (this.podeAvancar()) {
      this.mensagem.set('Preparação concluída. As duas frotas estão prontas.');
      this.fase.set('pronta');
    }
  }
}
