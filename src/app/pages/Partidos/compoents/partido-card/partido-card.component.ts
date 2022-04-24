import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Partido, Estado } from '../../../../interfaces/usuario';
import { PartidosService } from '../../../../services/partidos.service';
import { PartidoPage } from '../../partido/partido.page';

@Component({
  selector: 'app-partido-card',
  templateUrl: './partido-card.component.html',
  styleUrls: ['./partido-card.component.scss'],
})
export class PartidoCardComponent implements OnInit {

  @Input() partido: Partido;
  Estado = Estado;

  urlLocal: string = "";
  urlVisitante: string = "";


  constructor(private partidoService: PartidosService, private modalController: ModalController) {
  }
  ngOnInit(): void {

    if (this.partido.equipoL == "Alcasser") {
      this.urlLocal = '../../../../../assets/img/escut.png'
      this.partidoService.getIamge(this.partido.equipoV.toLowerCase()).then(url => this.urlVisitante = url)
    } else if (this.partido.equipoV == "Alcasser") {
      this.urlVisitante = '../../../../../assets/img/escut.png'
      this.partidoService.getIamge(this.partido.equipoL.toLowerCase()).then(url => this.urlLocal = url)
    }
  }

  async presentModal(partido: Partido) {
    const modal = await this.modalController.create({
      component: PartidoPage,
      componentProps: { partido: partido },
      initialBreakpoint: 1,
      breakpoints: [0, 0.5, 1],
      mode: 'ios'
    });
    return await modal.present();
  }






}
