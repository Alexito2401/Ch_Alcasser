import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ContrasenaOlvidadaPageRoutingModule } from './contrasena-olvidada-routing.module';

import { ContrasenaOlvidadaPage } from './contrasena-olvidada.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ContrasenaOlvidadaPageRoutingModule
  ],
  declarations: [ContrasenaOlvidadaPage]
})
export class ContrasenaOlvidadaPageModule {}
