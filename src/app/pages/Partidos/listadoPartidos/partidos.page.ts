import { Component, OnInit, ViewChild } from '@angular/core';
import { Partido, Categoria, Jugador, Estado } from '../../../interfaces/usuario';
import { MenuController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../../services/user.service';
import { doc, getDoc } from "firebase/firestore";
import * as firebase from 'firebase/compat/app';
import { debounceTime, filter, flatMap, map, mapTo, switchMap, } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { fromArray } from "rxjs/internal/observable/fromArray";

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


  constructor(private menu: MenuController, private userService: UserService, private afs: AngularFirestore) {

  }

  async ngOnInit() {

    const docRef = doc(this.db, "users", this.userService.CurrentUser.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      this.currentUser = docSnap.data() as Jugador;

    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

    console.log(this.currentUser);


    if (sessionStorage.getItem('partidos')) {
      console.log('Session storage');
      this.partidos = JSON.parse(sessionStorage.getItem('partidos'));
      this.partidosFilter = of(this.partidos.filter(partido => partido.categoria == this.currentUser.categoria))
      console.log(this.partidosFilter);
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
          console.log(this.partidosFilter);

        })
    }
  }

  hideMenu() {
    this.menu.isEnabled().then(value => value ? this.menu.enable(false) : this.menu.enable(true));
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
