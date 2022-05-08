import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Partido, Categoria, Jugador, Estado } from '../../../interfaces/usuario';
import { MenuController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../../services/user.service';
import * as firebase from 'firebase/compat/app';
import { debounceTime, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { doc, getDoc } from "firebase/firestore";
import { PartidosService } from '../../../services/partidos.service';
import { onAuthStateChanged } from 'firebase/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';

interface select {
  id: number,
  value: string
}

@Component({
  selector: 'app-partidos',
  templateUrl: './partidos.page.html',
  styleUrls: ['./partidos.page.scss'],
})
export class PartidosPage implements OnInit {

  select: select[] = [
    {
      id: 1,
      value: 'Tus partidos'
    },
    {
      id: 2,
      value: 'Todos los partidos'
    },
    {
      id: 3,
      value: 'Partidos perdidos'
    },
    {
      id: 4,
      value: 'Partidos ganados'
    },
    {
      id: 5,
      value: 'Por jugar'
    },

  ]

  categoria = Categoria;
  title: select = this.select[0];

  partidos: Partido[] = [];
  partidosFilter: Observable<Partido[]>;
  currentUser: Jugador = null;
  db = firebase.default.firestore();
  @ViewChild('filtrado') filtrado: ElementRef;


  constructor(private userService: UserService, private afs: AngularFirestore, public modalController: ModalController, private afsAuth: AngularFireAuth) {

  }

  ngOnInit() {

    this.afsAuth.onAuthStateChanged(async user => {
      if (user) {

        try {
          const docRef = doc(this.db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            this.currentUser = docSnap.data() as Jugador;
          }
        } catch (error) {

        }


        if (sessionStorage.getItem('partidos') && JSON.parse(sessionStorage.getItem('partidos')) != []) {
          this.partidos = JSON.parse(sessionStorage.getItem('partidos'));
          if (!this.currentUser) {
            this.partidosFilter = of([...this.partidos])
          } else {
            this.partidosFilter = of(this.partidos.filter(partido => partido.categoria == this.currentUser.categoria))
          }

        } else {
          this.afs
            .collection<Partido>("partidos")
            .get()
            .subscribe((ss) => {
              ss.docs.forEach((doc) => {
                this.partidos.push(doc.data());
              });
              sessionStorage.setItem('partidos', JSON.stringify(this.partidos))
              this.partidosFilter = of(this.partidos.filter(partido => partido.categoria == this.currentUser.categoria))
            })
        }

      } else {
        this.afs
          .collection<Partido>("partidos")
          .get()
          .subscribe((ss) => {
            ss.docs.forEach((doc) => {
              this.partidos.push(doc.data());
            });
            sessionStorage.setItem('partidos', JSON.stringify(this.partidos))
            this.partidosFilter = of(this.partidos.filter(partido => partido.categoria == this.currentUser.categoria))
          })
      }
    })
  }

  search(query) {
    query = this.reemplazarAcentos(query.target.value.toLowerCase())

    if (!query) {
      this.filtrarPor(this.title.id);
    } else {
      this.partidosFilter = this.partidosFilter.pipe(
        map(data => data.filter((partido) => this.reemplazarAcentos(partido.equipoL.toLowerCase()).includes(query) || this.reemplazarAcentos(partido.equipoV.toLowerCase()).includes(query))),
        debounceTime(300)
      )
    }
  }

  reemplazarAcentos(cadena): string {
    var chars = {
      "á": "a", "é": "e", "í": "i", "ó": "o", "ú": "u",
      "à": "a", "è": "e", "ì": "i", "ò": "o", "ù": "u",
      "Á": "A", "É": "E", "Í": "I", "Ó": "O", "Ú": "U",
      "À": "A", "È": "E", "Ì": "I", "Ò": "O", "Ù": "U",
    }
    var expr = /[áàéèíìóòúùñ]/ig;
    var res = cadena.replace(expr, function (e) { return chars[e] });
    return res;
  }

  async doRefresh(event) {
    sessionStorage.removeItem('partidos');

    await this.afs
      .collection<Partido>("partidos")
      .get()
      .subscribe((ss) => {
        ss.docs.forEach((doc) => {
          this.partidos.push(doc.data());
        });
        sessionStorage.setItem('partidos', JSON.stringify(this.partidos))
        const id = this.select.find(e => this.title.value == e.value);
        this.filtrarPor(id.id)
      })

    event.target.complete();
  }

  filtrarPor(id: number) {

    this.title = this.select.find(e => e.id == id);

    switch (id) {
      case 1:
        this.partidosFilter = of(this.partidos.filter(partido => partido.categoria == this.currentUser.categoria))
        break;
      case 2:
        this.partidosFilter = of([...this.partidos]);
        break;
      case 3:
        this.partidosFilter = of(this.partidos.filter(partido => (partido.golesL < partido.golesV && partido.equipoL == 'Alcasser' && partido.estado == Estado.completado) || (partido.golesV < partido.golesL && partido.equipoV == 'Alcasser' && partido.estado == Estado.completado)))
        break;
      case 4:
        this.partidosFilter = of(this.partidos.filter(partido => (partido.golesL > partido.golesV && partido.equipoL == 'Alcasser' && partido.estado == Estado.completado) || (partido.golesV > partido.golesL && partido.equipoV == 'Alcasser' && partido.estado == Estado.completado)))
        break;
      case 5:
        this.partidosFilter = of(this.partidos.filter(partido => partido.estado != Estado.completado))
        break;

      default:
        break;
    }
  }
}
