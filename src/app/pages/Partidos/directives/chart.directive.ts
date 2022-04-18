import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[Chart]',

})
export class ChartDirective {

  @Input() golesL: number = 0;
  @Input() golesV: number = 0;
  @Input() nombreAlcasser: string = "";
  htmlElement: ElementRef<HTMLElement>;
  porcentajes = null;

  constructor(private el: ElementRef<HTMLElement>) {
    this.htmlElement = el;
  }

  ngOnInit(): void {
    this.porcentajes = this.calcularPorcentaje();

    this.htmlElement.nativeElement.classList.add('chart');
    this.htmlElement.nativeElement.innerHTML = `
    <div style='display: flex;'>
    <div style='display:flex; justify-content:center; background-color: ${this.nombreAlcasser == "Alcasser" ? 'red' : 'green'}; height:25px; width:${this.porcentajes.local}%'>
    <b class="c-title" style='color: white;'>${this.golesL == 0 ? "" : this.golesL}</b>
    </div>
    <div style='display:flex; justify-content:center; background-color: ${this.nombreAlcasser != "Alcasser" ? 'red' : 'green'};  height:25px; width:${this.porcentajes.visitante}%'>
    <b class="c-title" style='color: white;'>${this.golesV == 0 ? "" : this.golesV}</b>
    </div>
    </div>
    `
  }

  calcularPorcentaje() {
    const total = this.golesL + this.golesV;
    return {
      local: ((this.golesL * 100) / total).toFixed(2),
      visitante: ((this.golesV * 100) / total).toFixed(2),
    }
  }

}
