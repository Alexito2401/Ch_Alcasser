import { Component } from '@angular/core';
import * as firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Jugador } from '../../.history/src/app/interfaces/usuario_20220425010321';
import { Observable, Observer, of, Subject } from 'rxjs';
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
      data.data().equipo.length > 1 ? this.linkEquipo = '/equipo/mis-equipos' : this.linkEquipo = '/equipo/mi-equipo'

      this.appPages = [
        { title: 'Partidos', url: '/partidos/partidos', icon: 'football-outline' },
        { title: this.titleEquipo, url: this.linkEquipo, icon: 'body' },
        { title: 'Equipos', url: '/folder/Favorites', icon: 'people' },
        { title: 'Patraocinadores', url: '/folder/Archived', icon: 'albums' },
        { title: 'Gestionar Equipo', url: '/folder/Trash', icon: 'person-add' },
      ];

    });
    this.email = user?.email;
    this.nombre = user?.displayName;
    this.urlImgUser = user.photoURL;


  });


  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
}
