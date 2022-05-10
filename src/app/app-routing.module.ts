import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/']);


const rediretLoggedInToChat = () => redirectLoggedInTo(['/']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/Login/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/Login/registrarse/registrarse.module').then(m => m.RegistrarsePageModule)
  },
  {
    path: 'verificar',
    loadChildren: () => import('./pages/Login/verificar-email/verificar-email.module').then(m => m.VerificarEmailPageModule)
  },
  {
    path: 'modificar',
    loadChildren: () => import('./pages/Login/modificar-perfil/modificar-perfil.module').then(m => m.ModificarPerfilPageModule)
  },
  {
    path: 'partidos',
    loadChildren: () => import('./pages/Partidos/partidos.module').then(m => m.PartidosModule)
  },
  {
    path: 'equipo',
    loadChildren: () => import('./pages/Mi_equipo/mi-equipo.module').then(m => m.MiEquipoModule),
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/Mi_perfil/mi-perfil.module').then(m => m.MiPerfilModule)
  },
  {
    path: 'patrocinadores',
    loadChildren: () => import('./pages/Patrocinadores/patrocinadores/patrocinadores.module').then(m => m.PatrocinadoresPageModule)
  },
  {
    path: 'contrasenya-olvidada',
    loadChildren: () => import('./pages/Login/contrasena-olvidada/contrasena-olvidada.module').then(m => m.ContrasenaOlvidadaPageModule)
  },
  {
    path: '**',
    redirectTo: '/'
  },


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
