import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartidosPage } from './listadoPartidos/partidos.page';

const routes: Routes = [
  {
    path: '',
    children: [{
      path: 'partidos',
      component: PartidosPage
    }]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidosRoutingModule { }
