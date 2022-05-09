import { Component, Input, OnInit } from '@angular/core';
import { Equipo } from 'src/app/interfaces/usuario';

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
    console.log(this.equipo);

    this.cantJugadores = this.equipo?.jugadores?.length || 0;
    this.cantPartidos = this.equipo?.jugadores?.length || 0;
  }
}
