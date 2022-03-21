import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore, private toastController: ToastController) { }

  GoogleAuth() {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();

    return signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const addinfo = getAdditionalUserInfo(result)
        const token = credential.accessToken;
        const user = result.user;
        console.log(addinfo.isNewUser);
        this.presentToast("Te has logeado con tu usuario de google", "Logueado");
        // ...
      }).catch((error) => {
        // const errorCode = error.code;
        // const errorMessage = error.message;
        // const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(error)
        this.presentToast("Ha ocurrido un error. Intentelo de nuevo mas tarde", 'Error en el inicio de Sesion con google');
      });
  }

  async singIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }

  async SingOut() {
    return this.afAuth.signOut();
  }

  async presentToast(message: string, titulo: string) {
    const toast = await this.toastController.create({
      header: titulo,
      message,
      duration: 10000,
      icon: 'information-circle',
      cssClass: 'toast-custom-class'
    }).then((toast) => {
      toast.present();
    });

  }
}
