import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MiPerfilRoutingModule } from './mi-perfil-routing.module';
import { MiPerfilPage } from './mi-perfil/mi-perfil.page';
import { IonicModule } from '@ionic/angular';
import { AddStatsComponent } from './components/add-stats/add-stats.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [MiPerfilPage, AddStatsComponent],
  imports: [
    CommonModule,
    IonicModule,
    MiPerfilRoutingModule,
    FormsModule
  ]
})
export class MiPerfilModule { }
