import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { Coordenada, Linha } from '../dominio/motor-do-jogo';

export type EstadoCasaCombate = 'oculta' | 'embarcacao' | 'agua' | 'acerto' | 'destruida';

export interface CasaCombate {
  coordenada: Coordenada;
  estado: EstadoCasaCombate;
  descricao: string;
}

@Component({
  selector: 'app-tabuleiro-combate',
  standalone: true,
  templateUrl: './tabuleiro-combate.html',
})
export class TabuleiroCombate {
  @Input({ required: true }) nome = '';
  @Input({ required: true }) casas: readonly CasaCombate[] = [];
  @Input() permitirAtaque = false;
  @Output() readonly ataque = new EventEmitter<Coordenada>();
  protected readonly linhas: readonly Linha[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  protected readonly colunas = Array.from({ length:  10 }, (_, indice) => indice + 1);

  protected casa(linha: Linha, coluna: number): CasaCombate {
    return this.casas.find((casa) => casa.coordenada.linha === linha && casa.coordenada.coluna === coluna)
      ?? { coordenada: { linha, coluna }, estado: 'oculta', descricao: 'sem resultado' };
  }

  protected simbolo(estado: EstadoCasaCombate): string {
    return estado === 'agua' ? '·' : estado === 'embarcacao' ? '■' : estado === 'acerto' ? '×' : estado === 'destruida' ? '✹' : '';
  }
}
