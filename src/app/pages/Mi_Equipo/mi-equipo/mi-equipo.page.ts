import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Component, Input, OnInit } from '@angular/core';

import { Jugador, Equipo, Categoria } from '../../../interfaces/usuario';
import { UserService } from '../../../services/user.service';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { Posicion } from 'src/app/interfaces/usuario';
import { PartidosService } from 'src/app/services/partidos.service';

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
  equipo: Equipo = null;
  user: Jugador = null;
  jugadores: Jugador[] = [];
  jugadoresOrdenados: JugadorOrdenados[] = [];


  constructor(private userService: UserService, private afs: AngularFirestore, private partidoService: PartidosService) {

  }

  ngOnInit() {

    this.equipo = this.partidoService.getEquipo();
    this.uidEquipo = this.equipo.uid;

    this.jugadoresOrdenados.forEach(e => e.jugadores.forEach(console.log))
    if (sessionStorage.getItem(this.equipo.uid)) {
      this.jugadoresOrdenados = JSON.parse(sessionStorage.getItem(this.equipo.uid))
      this.jugadoresOrdenados = this.shuffle(this.jugadoresOrdenados)
      console.log(this.jugadoresOrdenados)
    } else {
      this.userService.CurrentUserPromise.then(user => console.log(user.uid))

      this.afs.collection('users').doc<Jugador>(this.userService.CurrentUser.uid).get().pipe(
        switchMap(user => {
          if (this.uidEquipo == null) {
            return this.afs.collection('equipos').doc<Equipo>(user.data().equipo[0]).get()
          } else {
            return this.afs.collection('equipos').doc<Equipo>(this.uidEquipo).get()
          }
        }), tap(data => this.equipo = data.data()),
        switchMap(data => {
          const observable = this.equipo.jugadores.map(jugador => this.afs.collection('users').doc<Jugador>(jugador).get())
          return forkJoin(observable)
        })

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

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    sessionStorage.setItem(this.equipo.uid, JSON.stringify(this.jugadoresOrdenados))
  }
}
