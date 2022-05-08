import { Component, Input, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-add-stats',
  templateUrl: './add-stats.component.html',
  styleUrls: ['./add-stats.component.scss'],
})
export class AddStatsComponent implements OnInit {

  @Input() campo: string = "";
  value: number = 0;

  constructor(private popoverController: PopoverController) { }

  ngOnInit() { }


  async closePopover(operacion: string) {
    this.campo == 'Tiempo de juego' ? this.campo = 'tiempoJuego' : ''
    await this.value !== 0 ? this.popoverController.dismiss({ value: this.value, campo: this.campo, operacion: operacion }) : this.popoverController.dismiss();
  }

}
