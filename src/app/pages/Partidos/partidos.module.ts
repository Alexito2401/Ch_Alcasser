import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PartidosRoutingModule } from './partidos-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { PartidosPage } from './listadoPartidos/partidos.page';
import { IonicModule } from '@ionic/angular';
import { PartidoCardComponent } from './compoents/partido-card/partido-card.component';
import { ChartDirective } from './directives/chart.directive';
import { PartidoPage } from './partido/partido.page';


@NgModule({
  declarations: [PartidosPage, PartidoPage, PartidoCardComponent, ChartDirective],
  imports: [
    CommonModule,
    PartidosRoutingModule,
    IonicModule,
    SharedModule,
  ]
})
export class PartidosModule { }
