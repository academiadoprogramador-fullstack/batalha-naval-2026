import { TestBed } from '@angular/core/testing';
import { App } from './app';

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
    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();

    const elemento = fixture.nativeElement as HTMLElement;
    expect(elemento.querySelectorAll('[role="gridcell"]')).toHaveLength(100);
    expect(elemento.querySelectorAll('aside button[aria-pressed]')).toHaveLength(7);
    expect(elemento.textContent?.match(/Pendente/g)).toHaveLength(5);
    expect(elemento.querySelector('button[disabled]')?.textContent).toContain('Avançar');
    expect(elemento.textContent).not.toContain('A1,');
  });

  it('mostra os rótulos do tabuleiro e atualiza as casas ocupadas após posicionar', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();

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
    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();
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
    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();
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

  it('mantém a frota do computador oculta e conclui a preparação sem iniciar combate', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    fixture.nativeElement.querySelector('button')?.click();
    fixture.detectChanges();
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
    const avancar = [...elemento.querySelectorAll('button')].find((botao) => botao.textContent?.includes('Avançar'));
    expect(avancar?.disabled).toBe(false);
    avancar?.click();
    fixture.detectChanges();
    expect(elemento.textContent).toContain('Preparação concluída');
    expect(elemento.textContent).toContain('A partida ainda não começou.');
    expect(elemento.textContent).not.toContain('A1');
    expect(elemento.querySelector('button')).toBeFalsy();
  });
});
