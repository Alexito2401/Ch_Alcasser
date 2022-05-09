import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiEquipoPage } from './mi-equipo/mi-equipo.page';
import { MisEquiposPage } from './mis-equipos/mis-equipos.page';
import { OtrosEquiposPage } from './otros-equipos/otros-equipos.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'equipo',
        component: MiEquipoPage
      },
      {
        path: 'mis-equipos',
        component: MisEquiposPage
      },
      {
        path: 'equipos',
        component: OtrosEquiposPage
      }
    ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiEquipoRoutingModule { }
