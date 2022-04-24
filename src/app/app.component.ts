import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { UserService } from './services/user.service';
import * as firebase from 'firebase/compat/app';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private so: ScreenOrientation, private afAuth: AngularFireAuth, private userService: UserService) {


  }

  email: string = "";
  nombre: string = "";
  urlImgUser : string = "";

  algo = firebase.default.auth().onAuthStateChanged(user => {
    this.email = user?.email;
    this.nombre = user?.displayName;
    this.urlImgUser = user.photoURL;
  });

  public appPages = [
    { title: 'Partidos', url: '/partidos/partidos', icon: 'football-sharp' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
}
