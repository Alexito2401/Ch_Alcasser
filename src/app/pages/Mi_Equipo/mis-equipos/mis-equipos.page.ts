import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { Equipo } from 'src/app/interfaces/usuario';
import { UserService } from "src/app/services/user.service";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { of, forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { PartidosService } from 'src/app/services/partidos.service';

@Component({
  selector: 'app-mis-equipos',
  templateUrl: './mis-equipos.page.html',
  styleUrls: ['./mis-equipos.page.scss'],
})
export class MisEquiposPage implements OnInit {

  constructor(private userService: UserService, private afs: AngularFirestore, private router: Router, private partidoService: PartidosService) { }

  equipos: Equipo[] = [];

  ngOnInit() {
    this.userService.currentUserFireStore().pipe(
      switchMap(data => {
        const observable = data.data().equipo.map(equipo => {
          return this.afs.collection('equipos').doc<Equipo>(equipo).get()
        })
        return forkJoin(observable)
      })
    ).subscribe(data => data.forEach(e => this.equipos.push(e.data())))
  }

  goToEquipo(equipo: Equipo) {
    this.partidoService.setEquipo(equipo);

    this.router.navigateByUrl('/equipo/mi-equipo', { replaceUrl: true })
  }

}
