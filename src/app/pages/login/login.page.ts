import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { tap } from "rxjs/operators";

import { AuthService } from '../../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { Jugador } from '../../interfaces/usuario';
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
    private _db: AngularFireDatabase,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private router: Router) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  get email() {
    return this.credentialForm.get('email')
  }

  get password() {
    return this.credentialForm.get('password')
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
              this.router.navigateByUrl('modificar-perfil', { replaceUrl: true })
            }).catch(async (err) => {
              console.log(err.code)
              let alert;
              this.authService.codigoErrores(err.code, this.alertController)
              loading.dismiss();
              await alert.present();
            })
          } else if (currentUser.emailVerified && !loggedUser.newUser) {
            this.router.navigateByUrl('modificar', { replaceUrl: true });
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
