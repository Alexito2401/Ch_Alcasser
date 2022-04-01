import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  credentialForm: FormGroup;

  constructor(private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  async signUp() {
    if (this.password.value === this.confirmPassword.value) {
      const loading = await this.loadingController.create();
      await loading.present();

      this.authService.singUp(this.credentialForm.value)
        .then(async (user) => {
          await (await (this.afAuth.currentUser)).sendEmailVerification();
          loading.dismiss();
          this.authService.presentToast("Se ha creado tu usuario :)", "Usuario Creado");
          this.router.navigateByUrl('verificar', { replaceUrl: true })
        }, async err => {
          this.authService.codigoErrores(err.code, this.alertController)
          loading.dismiss();

        })
    } else {
      this.authService.presentToast("Contraseñas deben ser las mismas", "Error");
    }
  }

  get email() {
    return this.credentialForm.get('email')
  }

  get password() {
    return this.credentialForm.get('password')
  }
  get confirmPassword() {
    return this.credentialForm.get('confirmPassword')
  }
  get username() {
    return this.credentialForm.get('username')
  }


}
