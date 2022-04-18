import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Partido, Estado } from '../../../../interfaces/usuario';

@Component({
  selector: 'app-partido-card',
  templateUrl: './partido-card.component.html',
  styleUrls: ['./partido-card.component.scss'],
})
export class PartidoCardComponent implements OnInit {

  @Input() partido: Partido;
  Estado = Estado;

  constructor() {
  }
  ngOnInit(): void {

  }






}
