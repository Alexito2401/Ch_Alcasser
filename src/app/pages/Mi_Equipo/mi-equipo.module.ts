import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MiEquipoPage } from './mi-equipo/mi-equipo.page';
import { IonicModule } from '@ionic/angular';
import { MiEquipoRoutingModule } from './mi-equipo-routing.module';
import { MisEquiposPage } from './mis-equipos/mis-equipos.page';
import { EquipoCardComponent } from './components/equipo-card/equipo-card.component';

@NgModule({
  declarations: [MiEquipoPage, MisEquiposPage, EquipoCardComponent],
  imports: [
    CommonModule,
    IonicModule,
    MiEquipoRoutingModule
  ]
})
export class MiEquipoModule { }
