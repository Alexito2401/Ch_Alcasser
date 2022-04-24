import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Partido } from '../../../interfaces/usuario';

@Directive({
  selector: '[StatsChart]',

})
export class StatsChartDirective {

  @Input() partido: Partido = null;
  @Input() stat1: number = 0;
  @Input() stat2: number = 0;
  mostrar : boolean = false;
  @Input() set mostarPorcentaje(mostrarPorcentaje : boolean) {
    this.mostrar = mostrarPorcentaje;
    this.ngOnInit()
  }



  htmlElement: ElementRef<HTMLElement>;
  porcentajes = null;

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }

  ngOnInit(): void {
    this.porcentajes = this.calcularPorcentaje();

    this.htmlElement.nativeElement.classList.add('chart');
    this.setPorcentajes();
  }
  setPorcentajes() {
    this.htmlElement.nativeElement.innerHTML = `
    <div style='display: flex;'">
    <div style='border-radius: 5px 0 0 5px; display:flex; justify-content:center; background-color: ${this.partido.equipoL == "Alcasser" ? 'red' : 'green'}; height:25px; width:${this.porcentajes.st1}%'>
    <b class="c-title" style='color: white;'>${this.stat1 == 0 ? "" : this.mostrar == false ? this.stat1 : this.porcentajes.st1 + "%"}</b>
    </div>
    <div style='border-radius: 0 5px 5px 0; display:flex; justify-content:center; background-color: ${this.partido.equipoL != "Alcasser" ? 'red' : 'green'};  height:25px; width:${this.porcentajes.st2}%'>
    <b class="c-title" style='color: white;'>${this.stat2 == 0 ? "" : this.mostrar == false ? this.stat2 : this.porcentajes.st2 + "%"}</b>
    </div>
    </div>
    `
  }

  calcularPorcentaje() {

    const total = this.stat1 + this.stat2;
    return {
      st1: ((this.stat1 * 100) / total).toFixed(2),
      st2: ((this.stat2 * 100) / total).toFixed(2),
    }
  }
}
