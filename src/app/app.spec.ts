import { TestBed } from '@angular/core/testing';
import { criarTabuleiro, LINHAS, posicionarEmbarcacao, TAMANHOS_FROTA, type Coordenada, type Tabuleiro, type TipoEmbarcacao } from './dominio/motor-do-jogo';
import { App } from './app';

const frotaCompletaTeste = (): Tabuleiro => {
  let tabuleiro = criarTabuleiro();
  const tipos = Object.keys(TAMANHOS_FROTA) as TipoEmbarcacao[];
  tipos.forEach((tipo, indice) => {
    const posicionado = posicionarEmbarcacao(tabuleiro, tipo, { linha: LINHAS[indice]!, coluna: 1 }, 'horizontal');
    if (posicionado.ok) tabuleiro = posicionado.valor;
  });
  return tabuleiro;
};

const todasCoordenadas = (): Coordenada[] => LINHAS.flatMap((linha) =>
  Array.from({ length: 10 }, (_, indice) => ({ linha, coluna: indice + 1 })),
);

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('deve renderizar o cabecalho com o nome do jogo, o icone e a area principal', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;

    expect(elemento.querySelector('h1')?.textContent).toContain('Batalha Naval');
    expect(elemento.querySelector('header svg')).toBeTruthy();
    expect(elemento.querySelector('main')).toBeTruthy();
  });

  it('inicia a preparação com tabuleiro vazio e cinco embarcações pendentes', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelectorAll('[role="gridcell"]')).toHaveLength(100);
    expect(elemento.querySelectorAll('aside button[aria-pressed]')).toHaveLength(7);
    expect(elemento.textContent?.match(/Pendente/g)).toHaveLength(5);
    expect(elemento.textContent).not.toContain('tabuleiro do computador');
    expect(elemento.textContent).not.toContain('A1,');
    expect(elemento.querySelector<HTMLButtonElement>('button')?.textContent).not.toContain('Iniciar partida');
    expect([...elemento.querySelectorAll<HTMLButtonElement>('button')].find((botao) => botao.textContent?.includes('Iniciar combate'))?.disabled).toBe(true);
  });

  it('inicia o combate diretamente da preparação somente após completar as duas frotas', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const app = fixture.componentInstance as unknown as {
      fase: () => string;
      tabuleiroJogador: { set(valor: Tabuleiro): void };
      iniciarCombate: () => void;
    };
    const elemento = fixture.nativeElement as HTMLElement;
    const iniciar = [...elemento.querySelectorAll<HTMLButtonElement>('button')].find((botao) => botao.textContent?.includes('Iniciar combate'))!;
    expect(app.fase()).toBe('preparacao');
    expect(iniciar.disabled).toBe(true);
    app.iniciarCombate();
    expect(app.fase()).toBe('preparacao');
    app.tabuleiroJogador.set(frotaCompletaTeste());
    fixture.detectChanges();
    expect(iniciar.disabled).toBe(false);
    expect(app.fase()).toBe('preparacao');
    iniciar.click();
    fixture.detectChanges();
    expect(app.fase()).toBe('combate');
    expect(elemento.querySelector('[role="status"]')?.textContent).toContain('Combate iniciado. É a vez do jogador.');
    expect(elemento.querySelectorAll('[aria-label^="Atacar "]')).toHaveLength(100);
    expect(elemento.querySelectorAll('[aria-label$="não atacada"]')).toHaveLength(200);
  });

  it('mostra os rótulos do tabuleiro e atualiza as casas ocupadas após posicionar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelector('[aria-label="Posicionar em B2, livre"]')).toBeTruthy();
    expect(elemento.querySelector('[role="gridcell"]')?.classList.contains('aspect-square')).toBe(true);
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em B2, livre"]')?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[aria-label="Posicionar em B2, ocupada"]')).toBeTruthy();
    expect(elemento.querySelector('[aria-label="Posicionar em B3, ocupada"]')).toBeTruthy();
    expect(elemento.querySelector('[aria-label="Posicionar em B4, ocupada"]')).toBeTruthy();
    expect(elemento.textContent).toContain('Porta-aviões posicionada em B2.');
    expect(elemento.querySelector<HTMLButtonElement>('button[aria-label^="Porta-aviões"]')?.style.backgroundColor).toBe('rgb(254, 202, 202)');
  });

  it('permite escolher orientação e reposicionar embarcação sem perder casas em uma falha', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    elemento.querySelector<HTMLButtonElement>('button[aria-label^="Cruzador"]')?.click();
    [...elemento.querySelectorAll<HTMLButtonElement>('button')].find((botao) => botao.textContent?.trim() === 'Vertical')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em B2, livre"]')?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[aria-label="Posicionar em C2, ocupada"]')).toBeTruthy();
    elemento.querySelector<HTMLButtonElement>('button[aria-label^="Cruzador"]')?.click();
    [...elemento.querySelectorAll<HTMLButtonElement>('button')].find((botao) => botao.textContent?.trim() === 'Horizontal')?.click();
    elemento.querySelector<HTMLButtonElement>('button[aria-label^="Porta-aviões"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em A1, livre"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em A8, livre"]')?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[aria-label="Posicionar em B2, ocupada"]')).toBeTruthy();
    expect(elemento.querySelector('[aria-label="Posicionar em A1, ocupada"]')).toBeTruthy();
    expect(elemento.querySelector('[role="status"]')?.textContent).toContain('não cabe no tabuleiro');
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em C3, livre"]')?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[aria-label="Posicionar em A1, ocupada"]')).toBeFalsy();
    expect(elemento.querySelector('[aria-label="Posicionar em C3, ocupada"]')).toBeTruthy();
  });

  it('aceita embarcações adjacentes e rejeita sobreposição sem alterar as anteriores', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    elemento.querySelector<HTMLButtonElement>('button[aria-label^="Destroyer"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em A1, livre"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('button[aria-label^="Submarino"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em A3, livre"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('button[aria-label^="Cruzador"]')?.click();
    fixture.detectChanges();
    elemento.querySelector<HTMLButtonElement>('[aria-label="Posicionar em A2, ocupada"]')?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[role="status"]')?.textContent).toContain('ocupa casas');
    expect(elemento.querySelector('[aria-label="Posicionar em A1, ocupada"]')).toBeTruthy();
    expect(elemento.querySelector('[aria-label="Posicionar em A3, ocupada"]')).toBeTruthy();
  });

  it('mantém a frota do computador oculta até concluir a preparação e inicia combate explicitamente', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.textContent).not.toContain('tabuleiro do computador');
    const frota = [
      ['Porta-aviões', 'A'],
      ['Encouraçado', 'B'],
      ['Cruzador', 'C'],
      ['Submarino', 'D'],
      ['Destroyer', 'E'],
    ];
    for (const [nome, linha] of frota) {
      elemento.querySelector<HTMLButtonElement>(`button[aria-label^="${nome}"]`)?.click();
      fixture.detectChanges();
      elemento.querySelector<HTMLButtonElement>(`[aria-label="Posicionar em ${linha}1, livre"]`)?.click();
      fixture.detectChanges();
    }
    const iniciar = [...elemento.querySelectorAll('button')].find((botao) => botao.textContent?.includes('Iniciar combate'));
    expect(iniciar?.disabled).toBe(false);
    iniciar?.click();
    fixture.detectChanges();
    expect(elemento.textContent).toContain('Sua vez de atacar.');
    expect(elemento.querySelectorAll('[aria-label^="Atacar "]')).toHaveLength(100);
    expect(elemento.textContent).not.toContain('Porta-aviões');
    expect(elemento.querySelectorAll('[aria-label$="não atacada"]')).toHaveLength(200);
    const alvo = elemento.querySelector<HTMLButtonElement>('[aria-label^="Atacar A10"]');
    expect(alvo?.tabIndex).toBe(0);
    expect(alvo?.classList.contains('aspect-square')).toBe(true);
    expect(alvo?.closest('.overflow-x-auto')).toBeTruthy();
    alvo?.focus();
    expect(document.activeElement).toBe(alvo);
    alvo?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[role="status"]')?.textContent).toMatch(/Você: A10, (água|acerto|embarcação destruída)/);
    expect(elemento.querySelector('[aria-label="Seu tabuleiro, linhas A a J e colunas 1 a 10"]')).toBeTruthy();
    expect(elemento.querySelector('[aria-label="Tabuleiro do computador, linhas A a J e colunas 1 a 10"]')).toBeTruthy();
    expect(elemento.textContent).toContain('O computador:');
    expect(elemento.querySelectorAll('[aria-label$="não atacada"]')).toHaveLength(198);
    alvo?.click();
    fixture.detectChanges();
    expect(elemento.querySelector('[role="status"]')?.textContent).toContain('Tentativa recusada: A10 já foi atacada');
    expect(elemento.textContent).toContain('É a vez do jogador.');

    const app = fixture.componentInstance as unknown as {
      fonteAleatoria: () => number;
      tabuleiroJogador: { set(tabuleiro: Tabuleiro): void; (): Tabuleiro };
      tabuleiroComputador: () => Tabuleiro | null;
      fase: () => string;
      desfecho: () => string | null;
    };
    const casaFinal = { linha: 'E', coluna: 2 } as Coordenada;
    app.tabuleiroJogador.set({
      ...app.tabuleiroJogador(),
      ataques: todasCoordenadas().filter((casa) => casa.linha !== casaFinal.linha || casa.coluna !== casaFinal.coluna),
    });
    app.fonteAleatoria = () => 0;
    elemento.querySelector<HTMLButtonElement>('[aria-label^="Atacar B10"]')?.click();
    fixture.detectChanges();
    expect(app.fase()).toBe('encerrada');
    expect(app.desfecho()).toBe('derrota');
    expect(elemento.querySelector('[role="status"]')?.textContent).toContain('sua frota foi destruída');
    expect(elemento.querySelectorAll('[aria-label^="Atacar "]')).toHaveLength(0);
    expect(elemento.querySelector('[role="dialog"] h3')?.textContent).toContain('Você perdeu.');
    expect(elemento.querySelector('[role="dialog"] button')?.textContent).toContain('Jogar novamente');
    expect(elemento.querySelector('[aria-label^="E2, destruiu"]')).toBeTruthy();
    expect(document.activeElement).toBe(elemento.querySelector('[role="dialog"] button'));
    expect(app.tabuleiroComputador()?.embarcacoes).toHaveLength(5);
  });

  it('encerra sem resposta do computador quando o jogador destrói a última embarcação', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const app = fixture.componentInstance as unknown as {
      fase: { set(valor: string): void; (): string };
      turno: { set(valor: string): void };
      tabuleiroJogador: { set(valor: Tabuleiro): void; (): Tabuleiro };
      tabuleiroComputador: { set(valor: Tabuleiro | null): void; (): Tabuleiro | null };
      atacarComputador(linha: string, coluna: number): void;
    };
    const computador = frotaCompletaTeste();
    const segmentos = computador.embarcacoes.flatMap((embarcacao) => {
      const tamanho = TAMANHOS_FROTA[embarcacao.tipo];
      return Array.from({ length: tamanho }, (_, indice) => ({
        linha: embarcacao.origem.linha,
        coluna: embarcacao.origem.coluna + indice,
      }));
    });
    const final = { linha: 'E', coluna: 2 } as Coordenada;
    const ataquesAnteriores = segmentos.filter((casa) => casa.linha !== final.linha || casa.coluna !== final.coluna);
    app.tabuleiroJogador.set(frotaCompletaTeste());
    app.tabuleiroComputador.set({ ...computador, ataques: ataquesAnteriores });
    app.fase.set('combate');
    app.turno.set('jogador');
    app.atacarComputador(final.linha, final.coluna);
    expect(app.fase()).toBe('encerrada');
    expect(app.tabuleiroComputador()?.ataques).toHaveLength(segmentos.length);
    expect(app.tabuleiroJogador().ataques).toHaveLength(0);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('Combate encerrado');
    expect(fixture.nativeElement.querySelector('[role="dialog"] h3')?.textContent).toContain('Você venceu!');
    expect(fixture.nativeElement.querySelectorAll('[aria-label^="Atacar "]')).toHaveLength(0);
    expect(document.activeElement).toBe(fixture.nativeElement.querySelector('[role="dialog"] button'));
  });

  it('registra acerto e água, recusando repetição e ataque fora do turno sem mutação', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const app = fixture.componentInstance as unknown as {
      fase: { set(valor: string): void };
      turno: { set(valor: string): void; (): string };
      fonteAleatoria: () => number;
      tabuleiroJogador: () => Tabuleiro;
      tabuleiroComputador: { set(valor: Tabuleiro | null): void; (): Tabuleiro | null };
      resultadosComputador: () => readonly { tipo: string; coordenada: Coordenada }[];
      atacarComputador(linha: string, coluna: number): void;
    };
    app.tabuleiroComputador.set(frotaCompletaTeste());
    app.fase.set('combate');
    app.turno.set('jogador');
    app.fonteAleatoria = () => 0;
    app.atacarComputador('A', 1);
    expect(app.resultadosComputador()[0]?.tipo).toBe('acerto');
    expect(app.turno()).toBe('jogador');
    const tamanhoAposAcerto = app.tabuleiroComputador()?.ataques.length;
    app.atacarComputador('J', 10);
    expect(app.resultadosComputador().at(-1)?.tipo).toBe('agua');
    const tamanhoAposAgua = app.tabuleiroComputador()?.ataques.length;
    app.atacarComputador('A', 1);
    expect(app.tabuleiroComputador()?.ataques.length).toBe(tamanhoAposAgua);
    expect(app.turno()).toBe('jogador');
    app.turno.set('computador');
    app.atacarComputador('B', 10);
    expect(app.tabuleiroComputador()?.ataques.length).toBe(tamanhoAposAgua);
    expect(tamanhoAposAcerto).toBe(1);
  });

  it('encerra sem habilitar novo ataque quando a resposta do computador destrói a frota do jogador', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const app = fixture.componentInstance as unknown as {
      fase: { set(valor: string): void; (): string };
      turno: { set(valor: string): void };
      fonteAleatoria: () => number;
      tabuleiroJogador: { set(valor: Tabuleiro): void; (): Tabuleiro };
      tabuleiroComputador: { set(valor: Tabuleiro | null): void };
      mensagem: () => string;
      desfecho: () => string | null;
      resultadosJogador: () => readonly { tipo: string; coordenada: Coordenada; embarcacao?: string }[];
      visaoJogador: () => readonly { coordenada: Coordenada; estado: string }[];
      atacarComputador(linha: string, coluna: number): void;
    };
    const jogador = frotaCompletaTeste();
    const computador = frotaCompletaTeste();
    const ultimaCasa = { linha: 'E', coluna: 2 } as Coordenada;
    app.tabuleiroJogador.set({ ...jogador, ataques: todasCoordenadas().filter((casa) => casa.linha !== ultimaCasa.linha || casa.coluna !== ultimaCasa.coluna) });
    app.tabuleiroComputador.set(computador);
    app.fase.set('combate');
    app.turno.set('jogador');
    app.fonteAleatoria = () => 0;
    app.atacarComputador('J', 10);
    expect(app.fase()).toBe('encerrada');
    expect(app.desfecho()).toBe('derrota');
    expect(app.resultadosJogador()).toHaveLength(1);
    expect(app.resultadosJogador()[0]?.tipo).toBe('destruida');
    expect(app.mensagem()).toContain('Destroyer');
    const golpeFinal = app.resultadosJogador()[0]!.coordenada;
    expect(app.visaoJogador().find((casa) => casa.coordenada.linha === golpeFinal.linha && casa.coordenada.coluna === golpeFinal.coluna)?.estado).toBe('destruida');
    expect(app.mensagem()).toContain('sua frota foi destruída');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('[role="status"]')?.textContent).toContain('sua frota foi destruída');
  });

  it('reinicia e permite posicionar uma frota nova antes de um segundo combate independente', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const app = fixture.componentInstance as unknown as {
      fase: { set(valor: string): void; (): string };
      desfecho: { set(valor: 'vitoria' | 'derrota' | null): void; (): string | null };
      tabuleiroJogador: { set(valor: Tabuleiro): void; (): Tabuleiro };
      tabuleiroComputador: { set(valor: Tabuleiro | null): void; (): Tabuleiro | null };
      resultadosComputador: { set(valor: readonly unknown[]): void; (): readonly unknown[] };
      resultadosJogador: { set(valor: readonly unknown[]): void; (): readonly unknown[] };
      turno: () => string;
      iniciarPreparacao(): void;
      iniciarCombate(): void;
      atacarComputador(linha: string, coluna: number): void;
    };
    app.fase.set('encerrada');
    app.desfecho.set('vitoria');
    app.tabuleiroJogador.set(frotaCompletaTeste());
    app.tabuleiroComputador.set(frotaCompletaTeste());
    app.resultadosComputador.set([{ tipo: 'agua', coordenada: { linha: 'A', coluna: 1 } }]);
    app.resultadosJogador.set([{ tipo: 'acerto', coordenada: { linha: 'A', coluna: 1 } }]);
    fixture.detectChanges();
    const botaoReiniciar = [...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button')]
      .find((botao) => botao.textContent?.includes('Jogar novamente'))!;
    botaoReiniciar.focus();
    expect(document.activeElement).toBe(botaoReiniciar);
    botaoReiniciar.click();
    fixture.detectChanges();
    const elemento = fixture.nativeElement as HTMLElement;
    expect(document.activeElement).toBe(elemento.querySelector('#titulo-preparacao'));
    expect(app.fase()).toBe('preparacao');
    expect(app.desfecho()).toBeNull();
    expect(app.tabuleiroJogador().embarcacoes).toHaveLength(0);
    expect(app.resultadosComputador()).toHaveLength(0);
    expect(app.resultadosJogador()).toHaveLength(0);
    const frota = [['Porta-aviões', 'A'], ['Encouraçado', 'B'], ['Cruzador', 'C'], ['Submarino', 'D'], ['Destroyer', 'E']];
    for (const [nome, linha] of frota) {
      elemento.querySelector<HTMLButtonElement>(`button[aria-label^="${nome}"]`)?.click();
      fixture.detectChanges();
      elemento.querySelector<HTMLButtonElement>(`[aria-label="Posicionar em ${linha}1, livre"]`)?.click();
      fixture.detectChanges();
    }
    app.iniciarCombate();
    fixture.detectChanges();
    expect(app.fase()).toBe('combate');
    expect(app.turno()).toBe('jogador');
    expect(elemento.querySelectorAll('[aria-label^="Atacar "]')).toHaveLength(100);
    const inimigo = frotaCompletaTeste();
    const coordenadaFinal = { linha: inimigo.embarcacoes[0]!.origem.linha, coluna: inimigo.embarcacoes[0]!.origem.coluna };
    app.tabuleiroComputador.set({ ...inimigo, ataques: todasCoordenadas().filter((casa) => casa.linha !== coordenadaFinal.linha || casa.coluna !== coordenadaFinal.coluna) });
    app.atacarComputador(coordenadaFinal.linha, coordenadaFinal.coluna);
    expect(app.fase()).toBe('encerrada');
    expect(app.desfecho()).toBe('vitoria');
  });
});
