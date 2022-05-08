import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MenuController, PopoverController, ToastController } from '@ionic/angular';
import { Jugador, Partido, UserStats } from 'src/app/interfaces/usuario';
import { UserService } from '../../../services/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { tap, switchMap, map } from 'rxjs/operators';
import { Posicion } from 'src/app/interfaces/usuario';
import * as firebase from 'firebase/compat/app';
import { AddStatsComponent } from '../components/add-stats/add-stats.component';
import * as _ from 'lodash';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  @ViewChild('content') elementView: ElementRef;

  user: Jugador = null;
  imgProfile: string = '../../../../assets/img/default-profile.png';
  cantPartidos: number = 0;
  currentStats: UserStats = {};
  updateStats: UserStats = {};
  posicion = Posicion;

  constructor(private menuController: MenuController, private userService: UserService, private afs: AngularFirestore, private popoverController: PopoverController, private toastController: ToastController, private afsAuth: AngularFireAuth) {
  }

  ngOnInit() {

    this.afsAuth.onAuthStateChanged(async user => {
      if (user) {
        this.imgProfile = user.photoURL
      }
    })


    this.menuController.close();

    if (sessionStorage.getItem('cantPartidos') && sessionStorage.getItem('user')) {
      this.cantPartidos = +sessionStorage.getItem('cantPartidos')
      this.user = JSON.parse(sessionStorage.getItem('user'));
      this.currentStats = { ...this.user.userStats }, this.updateStats = { ...this.user.userStats };
      console.log(this.currentStats);

    } else {
      this.userService.currentUserFireStore().pipe(
        tap(data => {
          this.user = data.data()
          sessionStorage.setItem('user', JSON.stringify(data.data()))
          this.currentStats = { ...this.user.userStats }, this.updateStats = { ...this.user.userStats };
        }),
        switchMap(data => this.afs.collection<Partido>('partidos').get()),
        map(data => {
          const equipos = this.user.equipo;
          let partidos: Partido[] = [];
          data.docs.forEach(e => {
            for (let equipo of equipos) {
              e.data().categoria.includes(equipo) ? partidos.push(e.data()) : '';
            }
          })
          sessionStorage.setItem('cantPartidos', partidos.length.toString())
          return partidos.length
        }),
      ).subscribe(data => this.cantPartidos = data)
    }
  }

  async createPopover(evento, campo) {
    const popover = await this.popoverController.create({
      component: AddStatsComponent,
      event: evento,
      mode: 'ios',
      componentProps: { campo },
      arrow: true
    })
    await popover.present()

    return await popover.onDidDismiss().then((data) => {
      if (data.data) {
        this.changeUserStats(data.data.operacion, +data.data.value, data.data.campo)
      }
    })
  }


  changeUserStats(operacion: string, value: number, campo: string) {
    if (operacion === '+' && this.updateStats[campo] >= 0) {
      this.updateStats[campo] += value
    }
    else if (operacion === '-' && this.updateStats[campo] >= 0) {
      if (value <= this.updateStats[campo]) {
        this.updateStats[campo] -= value
      }
    }

    if (this.updateStats[campo] < 0) {
      this.updateStats[campo] = 0;
    }
  }

  sameStats(currentStats, updatedStats) {
    return _.isEqual(currentStats, updatedStats);
  }

  updateStatsFirebase() {
    this.afs.doc(`users/${this.user.uid}`).update({ userStats: this.updateStats }).then(data => {
      sessionStorage.removeItem('user')
      this.afs.collection('users').doc<Jugador>(this.user.uid).get().subscribe(data => {
        this.user = data.data()
        sessionStorage.setItem('user', JSON.stringify(data.data()))
        this.currentStats = { ...data.data().userStats }
        this.updateStats = { ...data.data().userStats }
      })
    }).catch(err => {
      this.toastController.create({
        header: 'Error',
        message: 'Se ha producido un error, intentelo de nuevo',
        duration: 2,
        position: 'bottom',
        mode: 'ios'
      }).then(toast => toast.present())
    })
  }
}
