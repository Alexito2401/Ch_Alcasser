import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';
import { getAuth, signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo, applyActionCode, setPersistence } from "firebase/auth";
import * as firebase from 'firebase/compat/app';
import { Usuario, Jugador } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private toastController: ToastController,
    private router: Router) { }

  // GoogleAuth() {
  //   const provider = new GoogleAuthProvider();
  //   const auth = getAuth();

  //   return signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const addinfo = getAdditionalUserInfo(result)
  //       const token = credential.accessToken;
  //       const user = result.user;
  //       this.presentToast("Te has logeado con tu usuario de google", "Logueado");
  //       // ...
  //     }).catch((error) => {
  //       // const errorCode = error.code;
  //       // const errorMessage = error.message;
  //       // const email = error.email;
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       console.log(error)
  //       this.presentToast("Ha ocurrido un error. Intentelo de nuevo mas tarde", 'Error en el inicio de Sesion con google');
  //     });
  // }

  async singIn({ email, password }) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
  }


  async SingOut() {
    return await this.afAuth.signOut();
  }

  async presentToast(message: string, titulo: string) {
    const toast = await this.toastController.create({
      header: titulo,
      message,
      duration: 2000,
      icon: 'information-circle',
      cssClass: 'toast-custom-class'
    }).then((toast) => {
      toast.present();
    });

  }

  async singUp({ email, username, password }) {



    const credential = await this.afAuth.createUserWithEmailAndPassword(email, password).then((user) => {
      user.user.updateProfile({ displayName: username })
      return user;
    });

    const uid = credential.user.uid;

    const newUser: Jugador = {
      uid: credential.user.uid,
      email: credential.user.email,
      displayName: credential.user.displayName,
      edad: null,
      posicion: "",
      equipo: [],
      partidos: [],
      newUser: true,
      categoria : null
    }

    return this.afs.doc(
      `users/${uid}`
    ).set(newUser)
  }

  async codigoErrores(code: string, alertController: AlertController) {
    let alert;
    switch (code) {
      case "auth/invalid-email":
        alert = await alertController.create({
          header: ':(',
          message: "Email no es valido",
          buttons: ['OK'],
        });
        break;

      case "auth/invalid-password":
        alert = await alertController.create({
          header: ':(',
          message: "Contraseña no es valida",
          buttons: ['OK'],
        });
        break;

      case "auth/internal-error":
        alert = await alertController.create({
          header: ':(',
          message: "Error, intentelo otra vez",
          buttons: ['OK'],
        });
        break

      case "auth/network-request-failed":
        alert = await alertController.create({
          header: ':(',
          message: "Comprueba la conexion a internet",
          buttons: ['OK'],
        });
        break;

      case "auth/email-already-in-use":
        alert = await alertController.create({
          header: 'Correo en uso',
          message: "Este correo ya esta en uso",
          buttons: ['OK'],
        });
        break;
      case "auth/operation-not-allowed":
        alert = await alertController.create({
          header: 'Correo en uso',
          message: "Error con la base de datos, intentelo de nuevo",
          buttons: ['OK'],
        });
        break;
      case "auth/user-not-found":
        alert = await alertController.create({
          header: 'No se ha encontrado a este usuario',
          message: "El correo introducido no pertenece a ningun usuario",
          buttons: ['OK'],
        });
        break;
      case 'auth/wrong-password':
        alert = await alertController.create({
          header: 'Contraseña Incorrecta',
          message: "La contraseña introducida es incorrecta",
          buttons: ['OK'],
        });
        break;
      case 'auth/too-many-requests':
        alert = await alertController.create({
          header: 'Intentalo de nuevo mas tarde',
          message: "Respuestas bloqueadas en este dispositivo durante un tiempo",
          buttons: ['OK'],
        });
        break;
      case 'auth/requires-recent-login':
        alert = await alertController.create({
          header: 'Esta operacion es sensible',
          message: "Esta operacion es sensible y necesita volver a logearse",
          buttons: ['OK'],
        });
        break;

      default:
        alert = await alertController.create({
          header: 'Error inserperado',
          message: "Intentelo de nuevo mas tarde",
          buttons: ['OK'],
        });
        break;
    }

    await alert.present();
  }
}
