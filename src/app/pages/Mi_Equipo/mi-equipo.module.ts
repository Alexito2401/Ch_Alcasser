import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiEquipoPage } from './mi-equipo/mi-equipo.page';
import { IonicModule } from '@ionic/angular';
import { MiEquipoRoutingModule } from './mi-equipo-routing.module';
import { MisEquiposPage } from './mis-equipos/mis-equipos.page';
import { EquipoCardComponent } from './components/equipo-card/equipo-card.component';
import { OtrosEquiposPage } from './otros-equipos/otros-equipos.page';

@NgModule({
  declarations: [MiEquipoPage, MisEquiposPage, OtrosEquiposPage, EquipoCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    MiEquipoRoutingModule
  ],
  exports: []
})
export class MiEquipoModule { }
