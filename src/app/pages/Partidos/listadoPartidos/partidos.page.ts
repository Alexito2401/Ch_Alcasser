import { Component, OnInit } from '@angular/core';
import { Partido, Categoria, Jugador, Estado } from '../../../interfaces/usuario';
import { MenuController, ModalController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../../../services/user.service';
import * as firebase from 'firebase/compat/app';
import { debounceTime, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { doc, getDoc } from "firebase/firestore";
import { PartidoPage } from '../partido/partido.page';
import { AuthService } from '../../../services/auth.service';
import { PartidosService } from '../../../services/partidos.service';

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


  constructor(private menu: MenuController, private userService: UserService, private afs: AngularFirestore, public modalController: ModalController, private partidoService: PartidosService) {

  }

  async ngOnInit() {

    try {
      const docRef = doc(this.db, "users", firebase.default.auth().currentUser?.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        this.currentUser = docSnap.data() as Jugador;

      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    } catch (error) {

    }

    if (sessionStorage.getItem('partidos') && JSON.parse(sessionStorage.getItem('partidos')) != []) {
      console.log('Session storage');
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
          console.log('Guardado en session storage');

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

  doRefresh(event) {
    console.log('Pull Event Triggered!');
    setTimeout(() => {
      event.target.complete();
    }, 1500);
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

  insertar() {
    const nuevosPartidos : Partido[] = [
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Ontinyent',
        equipoV : 'Alcasser',
        golesL: 10,
        golesV : 25,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '10/02/2021 16:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Alcasser',
        equipoV : 'Florida',
        golesL: 21,
        golesV : 25,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '10/17/2021 12:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Benetusser',
        equipoV : 'Alcasser',
        golesL: 27,
        golesV : 22,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '10/24/2021 12:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Alcasser',
        equipoV : 'Xativa',
        golesL: 23,
        golesV : 31,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '10/30/2021 18:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Xativa B',
        equipoV : 'Alcasser',
        golesL: 25,
        golesV : 16,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '11/06/2021 17:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Alcasser',
        equipoV : 'Quart B',
        golesL: 28,
        golesV : 22,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '11/13/2021 19:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Buñol',
        equipoV : 'Alcasser',
        golesL: 31,
        golesV : 18,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '11/21/2021 11:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoL : 'Alcasser',
        equipoV : 'Ontinyent',
        golesL: 24,
        golesV : 16,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '27/11/2021 18:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoV : 'Alcasser',
        equipoL : 'Florida',
        golesL: 31,
        golesV : 26,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '12/18/2021 16:30'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoV : 'Benetusser',
        equipoL : 'Alcasser',
        golesL: 22,
        golesV : 35,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '01/15/2022 18:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoV : 'Alcasser',
        equipoL : 'Xativa',
        golesL: 36,
        golesV : 19,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '01/22/2022 19:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoV : 'Xativa B',
        equipoL : 'Alcasser',
        golesL: 25,
        golesV : 22,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '02/08/2022 16:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoV : 'Alcasser',
        equipoL : 'Quart B',
        golesL: 19,
        golesV : 23,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '02/05/2022 16:00'
      },
      {
        uid : this.partidoService.create_UUID(),
        equipoV : 'Buñol',
        equipoL : 'Alcasser',
        golesL: 18,
        golesV : 30,
        categoria : Categoria.SeniorB,
        estado : Estado.completado,
        fecha : '02/19/2022 18:00'
      },
    ];

    nuevosPartidos.forEach(partido => {
      return this.afs.doc(
        `partidos/${partido.uid}`
      ).set(partido)
    })
  }
}
