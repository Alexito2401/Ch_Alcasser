import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MiPerfilPage } from './mi-perfil/mi-perfil.page';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path : 'mi-perfil',
        component : MiPerfilPage
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MiPerfilRoutingModule { }
