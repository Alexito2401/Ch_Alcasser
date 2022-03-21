import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AuthService } from '../../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private authService: AuthService,
    private alertController: AlertController,
    private loadingController: LoadingController,) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })

    this.afAuth.currentUser.then(user => console.log(user))
  }

  get email() {
    return this.credentialForm.get('email')
  }

  get password() {
    return this.credentialForm.get('password')
  }

  signUpGoogle() {
    this.authService.GoogleAuth();
  }

  async signIn() {

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.singIn(this.credentialForm.value).then(user => {
      localStorage.setItem('uid', user.user.uid)
      loading.dismiss();
    }, async err => {
      console.log(err.code)
      let alert;
      switch (err.code) {
        case "auth/invalid-email":
          alert = await this.alertController.create({
            header: ':(',
            message: "Email no es valido",
            buttons: ['OK'],
          });
          break;

          case "auth/invalid-password" : 
          alert = await this.alertController.create({
            header: ':(',
            message: "Contraseña no es valida",
            buttons: ['OK'],
          });
          break;

        case "auth/internal-error":
          alert = await this.alertController.create({
            header: ':(',
            message: "Error, intentelo otra vez",
            buttons: ['OK'],
          });
          break

        case "auth/network-request-failed":
          alert = await this.alertController.create({
            header: ':(',
            message: "Comprueba la conexion a internet",
            buttons: ['OK'],
          });
          break;

        default:
          break;
      }
      loading.dismiss();
      await alert.present();
    })
  }
}
