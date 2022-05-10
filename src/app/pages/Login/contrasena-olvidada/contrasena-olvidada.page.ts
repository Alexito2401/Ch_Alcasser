import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ValidatorsService } from '../../../services/validators.service';
import * as firebase from 'firebase/compat/app';
import { AlertController, MenuController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-contrasena-olvidada',
  templateUrl: './contrasena-olvidada.page.html',
  styleUrls: ['./contrasena-olvidada.page.scss'],
})
export class ContrasenaOlvidadaPage implements OnInit {
  credentialForm: FormGroup;

  constructor(private fb: FormBuilder,
    private vs: ValidatorsService,
    private menu: MenuController,
    private alertController: AlertController,
    private authService: AuthService,
    private loadingController: LoadingController
  ) {
    this.menu.enable(false);
    this.menu.swipeGesture(false)

  }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.vs.emailPattern)]],
    })
  }

  get email() {
    return this.credentialForm.get('email')
  }

  async enviarContrsena() {
    const mensaje = {
      header: 'Correo enviado',
      message: "Se ha enviado un correo al email introducido",
      buttons: ['OK'],
    }
    const loading = await this.loadingController.create();
    await loading.present();

    await firebase.default.auth().sendPasswordResetEmail(this.email.value).then(() => this.alertController.create(mensaje).then(e => e.present()).catch(async (err) => {
      console.log(err.code)
      let alert;
      this.authService.codigoErrores(err.code, this.alertController)
      loading.dismiss();
      await alert.present();
    })).catch(err => {
      console.log(err.code)
      let alert;
      this.authService.codigoErrores(err.code, this.alertController)
      loading.dismiss();
      alert.present();
    });
    loading.dismiss();
  }
}

