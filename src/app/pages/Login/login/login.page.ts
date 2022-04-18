import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";

import { AuthService } from '../../../services/auth.service';
import { AlertController, LoadingController, MenuController } from '@ionic/angular';
import { Jugador } from '../../../interfaces/usuario';
import { ValidatorsService } from '../../../services/validators.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  credentialForm: FormGroup;
  passwordType = 'password'

  constructor(private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private authService: AuthService,
    private validatorService: ValidatorsService,
    private menu : MenuController,
    ) {

      this.menu.enable(false);
      this.menu.swipeGesture(false)

     }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(this.validatorService.emailPattern)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get email() {
    return this.credentialForm.get('email')
  }

  get password() {
    return this.credentialForm.get('password')
  }

  passwordVisible(){

    this.passwordType = this.passwordType == 'password' ? 'text' : 'password';

  }

  async signIn() {

    const loading = await this.loadingController.create();
    await loading.present();

    this.authService.singIn(this.credentialForm.value).then(async user => {
      localStorage.setItem('uid', user.user.uid)
      loading.dismiss();

      // const newUser = this.afs.collection(`users/`).doc(user.user.uid).valueChanges();
      // let isNewUser: boolean = false;

      // newUser.subscribe((data: Jugador) => {
      //   isNewUser = data.newUser;
      // })
      // this.afs.doc(`users/${user.user.uid}`).update({ newUser: false }).then(() => {
      //   newUser.unsuscribe()
      // });

      const a = await this.afs.collection('users').doc<Jugador>(user.user.uid).get().toPromise().then(data => {
        const loggedUser: Jugador = data.data()
        this.afAuth.currentUser.then((currentUser) => {
          if (currentUser && !currentUser.emailVerified) {
            this.router.navigateByUrl('verificar', { replaceUrl: true })
          } else if (currentUser.emailVerified && loggedUser.newUser) {
            this.afs.doc(`users/${user.user.uid}`).update({ newUser: false }).then(() => {
              this.router.navigateByUrl('modificar', { replaceUrl: true })
            }).catch(async (err) => {
              console.log(err.code)
              let alert;
              this.authService.codigoErrores(err.code, this.alertController)
              loading.dismiss();
              await alert.present();
            })
          } else if (currentUser.emailVerified && !loggedUser.newUser) {
            this.router.navigateByUrl('partidos/partidos', { replaceUrl: true });
            this.menu.enable(true);
            this.menu.swipeGesture(true)
          }
          else {
            console.log('Aun no cargado');
            console.log(loggedUser);
          }
        })
      }).catch(async err => {
        console.log(err.code)
        let alert;
        this.authService.codigoErrores(err.code, this.alertController)
        loading.dismiss();
        await alert.present();
      });
    }, async err => {
      console.log(err.code)
      let alert;
      this.authService.codigoErrores(err.code, this.alertController)
      loading.dismiss();
      await alert.present();
    })
  }
}
