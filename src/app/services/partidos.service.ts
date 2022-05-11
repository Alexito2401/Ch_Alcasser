import { Injectable } from '@angular/core';
import * as firebase from 'firebase/compat/app';
import { Equipo } from '../interfaces/usuario';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  constructor() { }

  equipo: Equipo = null;
  public currentEquipo = new BehaviorSubject<Equipo>(this.equipo);

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  getIamge = async (equipo: string) => {
    if (equipo.split(' ').length >= 2) {
      equipo = equipo.split(' ')[0];
    }

    if (localStorage.getItem(equipo)) {
      return localStorage.getItem(equipo);
    } else {
      return firebase.default.storage().ref().child(`equipos/${equipo.toLowerCase()}.png`).getDownloadURL().then(url => {
        localStorage.setItem(equipo, url);
        return url;
      });
    }
  }

  getEquipo(uid: string) {
    return JSON.parse("Equipo " + uid)
  }

  getUltimoEquipo() {
    const uid = sessionStorage.getItem("Ultimo equipo")
    sessionStorage.removeItem("Ultimo equipo")
    return uid;
  }

  setUltimoEquipo(uid: string) {
    sessionStorage.setItem("Ultimo equipo", uid)
  }

  setEquipo(equipo: Equipo) {
    sessionStorage.setItem("Equipo " + equipo.uid, JSON.stringify(equipo))
    this.setUltimoEquipo(equipo.uid)
    this.currentEquipo.next(equipo);
  }

}
