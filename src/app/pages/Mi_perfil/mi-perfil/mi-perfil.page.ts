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
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.page.html',
  styleUrls: ['./mi-perfil.page.scss'],
})
export class MiPerfilPage implements OnInit {

  @ViewChild('content') elementView: ElementRef;

  imgProfile = this.userService.currentImg;
  cantPartidos: number = 0;
  currentStats: UserStats = {};
  updateStats: UserStats = {};
  posicion = Posicion;
  currentUser: Jugador;

  constructor(private menuController: MenuController, private userService: UserService, private afs: AngularFirestore, private popoverController: PopoverController, private toastController: ToastController, private afsAuth: AngularFireAuth) {
  }
  currentPosicion = this.userService.currentPosicion;

  ngOnInit() {

    this.afsAuth.onAuthStateChanged(async user => {
      if (user) {
        this.imgProfile = this.userService.currentImg;

        this.afs.collection('users').doc<Jugador>(user.uid).get().subscribe(data => {
          this.currentUser = data.data()
          this.currentPosicion.next(this.currentUser.posicion)
        })


      }
    })


    this.menuController.close();


    this.userService.currentUserFireStore().pipe(
      tap(data => {
        this.currentUser = data.data()
        sessionStorage.setItem('user', JSON.stringify(data.data()))
        this.currentStats = { ...this.currentUser.userStats }, this.updateStats = { ...this.currentUser.userStats };
      }),
      switchMap(data => this.afs.collection<Partido>('partidos').get()),
      map(data => {
        const equipos = this.currentUser.equipo;
        let partidos: Partido[] = [];
        data.docs.forEach(e => {
          for (let equipo of equipos) {
            e.data().categoria.includes(equipo) ? partidos.push(e.data()) : '';
          }
        })
        return partidos.length
      }),
    ).subscribe(data => this.cantPartidos = data)

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
    this.afs.doc(`users/${this.currentUser.uid}`).update({ userStats: this.updateStats }).then(data => {
      sessionStorage.removeItem('user')
      this.afs.collection('users').doc<Jugador>(this.currentUser.uid).get().subscribe(data => {
        this.currentUser = data.data()
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
