import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContrasenaOlvidadaPage } from './contrasena-olvidada.page';

const routes: Routes = [
  {
    path: '',
    component: ContrasenaOlvidadaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContrasenaOlvidadaPageRoutingModule {}
