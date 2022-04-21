import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartidosPage } from './listadoPartidos/partidos.page';
import { PartidoPage } from './partido/partido.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'partidos',
        component: PartidosPage
      },
      {
        path: 'partido/:id',
        component: PartidoPage
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartidosRoutingModule { }
