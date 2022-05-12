import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/']);


const redirectLoggedInToPartidos = () => redirectLoggedInTo(['/partidos/partidos']);

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/Login/login/login.module').then(m => m.LoginPageModule)
    , ...canActivate(redirectLoggedInToPartidos)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/Login/registrarse/registrarse.module').then(m => m.RegistrarsePageModule)
    , ...canActivate(redirectLoggedInToPartidos)
  },
  {
    path: 'verificar',
    loadChildren: () => import('./pages/Login/verificar-email/verificar-email.module').then(m => m.VerificarEmailPageModule)
    , ...canActivate(redirectLoggedInToPartidos)
  },
  {
    path: 'modificar',
    loadChildren: () => import('./pages/Login/modificar-perfil/modificar-perfil.module').then(m => m.ModificarPerfilPageModule)
    , ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'partidos',
    loadChildren: () => import('./pages/Partidos/partidos.module').then(m => m.PartidosModule)
    , ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'equipo',
    loadChildren: () => import('./pages/Mi_equipo/mi-equipo.module').then(m => m.MiEquipoModule),
    ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/Mi_perfil/mi-perfil.module').then(m => m.MiPerfilModule)
    , ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'patrocinadores',
    loadChildren: () => import('./pages/Patrocinadores/patrocinadores/patrocinadores.module').then(m => m.PatrocinadoresPageModule)
    , ...canActivate(redirectUnauthorizedToLogin)
  },
  {
    path: 'contrasenya-olvidada',
    loadChildren: () => import('./pages/Login/contrasena-olvidada/contrasena-olvidada.module').then(m => m.ContrasenaOlvidadaPageModule)
    , ...canActivate(redirectLoggedInToPartidos)
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
