import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { doc, getDoc } from 'firebase/firestore';
import { forkJoin, observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Equipo, Categoria, Jugador } from 'src/app/interfaces/usuario';
import { PartidosService } from 'src/app/services/partidos.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import * as firebase from 'firebase/compat/app';

@Component({
  selector: 'app-otros-equipos',
  templateUrl: './otros-equipos.page.html',
  styleUrls: ['./otros-equipos.page.scss'],
})
export class OtrosEquiposPage implements OnInit {


  equipos: Equipo[] = [];
  db = firebase.default.firestore();
  currentUser: Jugador;

  constructor(private afsAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private partidoService: PartidosService) { }


  ngOnInit() {

    this.afsAuth.onAuthStateChanged(async user => {
      if (user) {

        try {
          const docRef = doc(this.db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            this.currentUser = docSnap.data() as Jugador;

            const equiposValidos = Object.values(Categoria).filter(categoria => !this.currentUser.equipo.includes(categoria))

            const observable = equiposValidos.map(equipo => {
              return this.afs.collection('equipos').doc<Equipo>(equipo).get()
            })

            forkJoin(observable).subscribe(data => data.forEach(e => this.equipos.push(e.data())))
          }
        }
        catch (error) { }

      }

    })
  }





  goToEquipo(equipo: Equipo) {
    this.partidoService.setEquipo(equipo);

    this.router.navigateByUrl('/equipo/equipo', { replaceUrl: true })
  }

}
