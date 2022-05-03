import { Component, Input, OnInit } from '@angular/core';
import { PartidosService } from '../../../services/partidos.service';
import { Partido } from '../../../interfaces/usuario';
import { convertToParamMap } from '@angular/router';

@Component({
  selector: 'app-partido',
  templateUrl: './partido.page.html',
  styleUrls: ['./partido.page.scss'],
})
export class PartidoPage implements OnInit {

  @Input() partido: Partido;
  imageLocal: string;
  imageVisitante: string;

  chart: boolean = false;
  statsExiste : boolean = false;

  cambiarNumeroPorcentaje: boolean = true;

  constructor(private partidoService: PartidosService) {

  }

  ngOnInit() {

    if (this.partido.equipoL == "Alcasser") {
      this.imageLocal = '../../../../../assets/img/escut.png'
      this.partidoService.getIamge(this.partido.equipoV).then(url => this.imageVisitante = url);
    } else if (this.partido.equipoV == "Alcasser") {
      this.imageVisitante = '../../../../../assets/img/escut.png'
      this.partidoService.getIamge(this.partido.equipoL).then(url => this.imageLocal = url);
    }

    this.statsExiste = convertToParamMap(this.partido.stats).keys.length == 0;
  }

  cambiarPorcentajeNumero() {
    this.chart = !this.chart;
  }
}
