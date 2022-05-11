import { Component, NgZone } from '@angular/core';
import * as firebase from 'firebase/compat/app';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Jugador } from 'src/app/interfaces/usuario';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { UserService } from './services/user.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
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

  constructor(private afs: AngularFirestore, private userService: UserService, private afsAuth: AngularFireAuth, private platform: Platform,
    private inAppBrowser: InAppBrowser,
    private appAvailability: AppAvailability,
    private router: Router) {

  }

  email: string = "";
  nombre: string = "";
  urlImgUser = this.userService.currentImg

  public appPages = [];


  firebase = firebase.default.auth().onAuthStateChanged(user => {
    if (user) {
      this.afs.collection('users').doc<Jugador>(user.uid).get().subscribe(data => {
        data.data().equipo.length > 1 ? this.titleEquipo = 'Mis Equipos' : this.titleEquipo = 'Mi Equipo'
        data.data().equipo.length > 1 ? this.linkEquipo = '/equipo/mis-equipos' : this.linkEquipo = '/equipo/equipo'

        this.appPages = [
          { title: 'Partidos', url: '/partidos/partidos', icon: 'football-outline' },
          { title: this.titleEquipo, url: this.linkEquipo, icon: 'body' },
          { title: 'Equipos', url: '/equipo/equipos', icon: 'people' },
          { title: 'Patraocinadores', url: 'patrocinadores', icon: 'albums' },
        ];

      });

      this.email = user?.email;
      this.nombre = user?.displayName;
    }
  });

  async logout() {
    await this.afsAuth.signOut().then(() => {
      this.router.navigateByUrl('/', { replaceUrl: true })
      sessionStorage.clear()

    })
  }

  socialMedia(type) {
    switch (type) {
      case 'FACEBOOK': {
        this.openFacebook('clubhandbolalcasser', 'https://www.facebook.com/clubhandbolalcasser/');
        break;
      }
      case 'INSTAGRAM': {
        this.openInstagram('chalcasser')
        break;
      }
      case 'TWITTER': {
        this.openTwitter('chalcasser');
        break;
      }
      case 'YOUTUBE': {
        this.openYoutube();
        break;
      }
    }
  }

  openFacebook(name, url) {
    let app;
    if (this.platform.is('ios')) {
      app = 'fb://';
    } else if (this.platform.is('android')) {
      app = 'com.facebook.katana';
    } else {
      this.openInApp('https://www.facebook.com/' + name);
      return;
    }
    this.appAvailability.check(app)
      .then(res => {
        const fbUrl = 'fb://facewebmodal/f?href=' + url;
        this.openInApp(fbUrl);
      }
      ).catch(() => {
        this.openInApp('https://www.facebook.com/' + name);
      });
  }
  openInApp(url) {
    this.inAppBrowser.create(url, '_system')
  }

  openInstagram(name) {
    let app;
    if (this.platform.is('ios')) {
      app = 'instagram://';
    } else if (this.platform.is('android')) {
      app = 'com.instagram.android';
    } else {
      this.openInApp('https://www.instagram.com/' + name);
      return;
    }
    this.appAvailability.check(app)
      .then((res) => {
        this.openInApp('instagram://user?username=' + name);
      }
      ).catch(err => {
        this.openInApp('https://www.instagram.com/' + name);
      });
  }

  openTwitter(name) {
    let app;
    if (this.platform.is('ios')) {
      app = 'twitter://';
    } else if (this.platform.is('android')) {
      app = 'com.twitter.android';
    } else {
      this.openInApp('https://twitter.com/' + name);
      return;
    }
    this.appAvailability.check(app)
      .then((res) => {
        const data = 'twitter://user?screen_name=' + name;
        this.openInApp(data);
      }
      ).catch(err => {
        this.openInApp('https://twitter.com/' + name);
      });
  }

  openYoutube() {
    let app;
    if (this.platform.is('ios')) {
      app = 'youtube://';
    } else if (this.platform.is('android')) {
      app = 'com.youtube.android';
    } else {
      this.openInApp('https://youtube.com/channel/UClTjVYGaC-9itiSxivCxhlQ');
      return;
    }
    this.appAvailability.check(app)
      .then((res) => {
        const data = 'twitter://user?screen_name=' + name;
        this.openInApp(data);
      }
      ).catch(err => {
        this.openInApp('https://youtube.com/channel/UClTjVYGaC-9itiSxivCxhlQ');
      });
  }
}
