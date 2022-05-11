import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, HostListener, OnInit } from '@angular/core';
import { doc, getDoc } from "firebase/firestore";
import { Jugador, Equipo } from '../../../interfaces/usuario';
import { UserService } from '../../../services/user.service';
import { switchMap, tap, finalize, catchError } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Posicion } from 'src/app/interfaces/usuario';
import { PartidosService } from 'src/app/services/partidos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';

interface JugadorOrdenados {
  posicion: Posicion,
  jugadores: JugadorFoto[]
}

interface JugadorFoto {
  jugador: Jugador,
  foto: string
}

@Component({
  selector: 'app-mi-equipo',
  templateUrl: './mi-equipo.page.html',
  styleUrls: ['./mi-equipo.page.scss'],
})
export class MiEquipoPage implements OnInit {

  uidEquipo: string = null;

  currentUser: Jugador = null;
  jugadores: Jugador[] = [];
  jugadoresOrdenados: JugadorOrdenados[] = [];
  db = firebase.default.firestore();
  equipo: Equipo = null;

  constructor(private userService: UserService, private afs: AngularFirestore, private partidoService: PartidosService, private afsAuth: AngularFireAuth) {

  }


  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.processData();
  }

  // execute this function before browser refresh


  ngOnInit() {
    this.uidEquipo = this.partidoService.getUltimoEquipo();
    this.cargarEquipo();
  }

  cargarEquipo() {

    if (sessionStorage.getItem(this.equipo?.uid)) {
      this.jugadoresOrdenados = JSON.parse(sessionStorage.getItem(this.equipo.uid))
      this.jugadoresOrdenados = this.shuffle(this.jugadoresOrdenados)
      console.log(this.jugadoresOrdenados)
    } else {
      return this.afs.collection('equipos').doc<Equipo>(this.uidEquipo).get().pipe(
        tap(data => this.equipo = data.data()),
        switchMap(data => {
          this.partidoService.setEquipo(data.data())
          const observable = this.equipo?.jugadores.map(jugador => this.afs.collection('users').doc<Jugador>(jugador).get())
          return forkJoin(observable)
        }),
        catchError(() => { return [] })
      ).subscribe({
        next: data => {
          data.forEach(jugador => this.jugadores.push(jugador.data()))

          Object.values(Posicion).forEach(posicion => {
            const jugadores = this.jugadores.filter(jugador => jugador.posicion == posicion)
            let jugadoresFoto: JugadorFoto[] = [];
            jugadores.map(async jugador => {
              let foto = '';
              await this.userService.getUserIamge(jugador.uid).then(url => foto = url).catch(() => foto = '../../../../assets/img/default-profile.png');
              jugadoresFoto.push({ jugador, foto })
            })
            const jugadorOrdenado: JugadorOrdenados = {
              posicion,
              jugadores: jugadoresFoto
            };

            this.jugadoresOrdenados.push(jugadorOrdenado)
          })
          this.jugadoresOrdenados = this.shuffle(this.jugadoresOrdenados)
        },
      });
    }

  }

  shuffle(array: Array<JugadorOrdenados>) {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }

  processData() {
    sessionStorage.setItem('currentValueUID', this.equipo.uid)
    sessionStorage.setItem(this.equipo.uid, JSON.stringify(this.jugadoresOrdenados))
  }

  ngOnDestroy(): void {
    sessionStorage.setItem(this.equipo.uid, JSON.stringify(this.jugadoresOrdenados))
  }
}
