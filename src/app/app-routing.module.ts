import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from "./guards/auth.guard";
import { canActivate, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/compat/auth-guard'

const redirectUnauthorizedToLogin = () =>
  redirectUnauthorizedTo(['/']);


const rediretLoggedInToChat = () => redirectLoggedInTo(['/']);

const routes: Routes = [
  // {
  //   path: '',
  //   redirectTo: 'folder/Inbox',
  //   pathMatch: 'full'
  // },
  {
    path: 'verificar',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'registrarse',
    loadChildren: () => import('./pages/registrarse/registrarse.module').then(m => m.RegistrarsePageModule)
  },
  {
    path: '',
    loadChildren: () => import('./pages/verificar-email/verificar-email.module').then(m => m.VerificarEmailPageModule)
  },
  {
    path: '**',
    redirectTo: '/'
  }

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
