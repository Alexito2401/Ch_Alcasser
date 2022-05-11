import { Component, Input, OnInit } from '@angular/core';
import { Equipo, Partido } from 'src/app/interfaces/usuario';

@Component({
  selector: 'equipo-card',
  templateUrl: './equipo-card.component.html',
  styleUrls: ['./equipo-card.component.scss'],
})
export class EquipoCardComponent implements OnInit {

  @Input() equipo: Equipo = null;
  cantJugadores = 0;
  cantPartidos = 0;

  constructor() { }

  ngOnInit() {

    const partidos: Partido[] = JSON.parse(sessionStorage.getItem('partidos'))
    this.cantPartidos = partidos.filter(partido => partido.categoria == this.equipo.uid).length || 0

    this.cantJugadores = this.equipo?.jugadores?.length || 0;
  }
}
