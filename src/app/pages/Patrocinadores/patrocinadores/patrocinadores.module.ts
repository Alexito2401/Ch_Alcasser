import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PatrocinadoresPageRoutingModule } from './patrocinadores-routing.module';

import { PatrocinadoresPage } from './patrocinadores.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PatrocinadoresPageRoutingModule
  ],
  declarations: [PatrocinadoresPage]
})
export class PatrocinadoresPageModule {}
