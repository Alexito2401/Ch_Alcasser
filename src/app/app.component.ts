import { Component } from '@angular/core';
import * as firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Jugador } from 'src/app/interfaces/usuario';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './services/user.service';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  currentUser: Jugador = null;
  titleEquipo$: Observable<string> = null;
  linkEquipo$: Observable<string> = null;
  titleEquipo: string = "";
  linkEquipo: string = "";

  constructor(private afs: AngularFirestore) {

  }

  email: string = "";
  nombre: string = "";
  urlImgUser: string = "";

  public appPages = [];

  firebase = firebase.default.auth().onAuthStateChanged(user => {
    this.afs.collection('users').doc<Jugador>(user.uid).get().subscribe(data => {
      data.data().equipo.length > 1 ? this.titleEquipo = 'Mis Equipos' : this.titleEquipo = 'Mi Equipo'
      data.data().equipo.length > 1 ? this.linkEquipo = '/equipo/mis-equipos' : this.linkEquipo = '/equipo/equipo'

      this.appPages = [
        { title: 'Partidos', url: '/partidos/partidos', icon: 'football-outline' },
        { title: this.titleEquipo, url: this.linkEquipo, icon: 'body' },
        { title: 'Equipos', url: '/equipo/equipos', icon: 'people' },
        { title: 'Patraocinadores', url: '/folder/Archived', icon: 'albums' },
      ];

    });
    this.email = user?.email;
    this.nombre = user?.displayName;
    this.urlImgUser = user?.photoURL || '../assets/img/default-profile.png';
  });
}
