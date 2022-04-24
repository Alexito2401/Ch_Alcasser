import { Injectable } from '@angular/core';
import * as firebase from 'firebase/compat/app';
import { url } from 'inspector';

@Injectable({
  providedIn: 'root'
})
export class PartidosService {

  constructor() { }

  create_UUID() {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx'.replace(/[xy]/g, function (c) {
      var r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

  async getIamge(equipo: string) {
    if (equipo.split(' ').length >= 2) {
      equipo = equipo.split(' ')[0];
    }

    if (localStorage.getItem(equipo)) {
      return localStorage.getItem(equipo);
    } else {
      return await firebase.default.storage().ref().child(`equipos/${equipo.toLowerCase()}.png`).getDownloadURL().then(url => {
        localStorage.setItem(equipo, url);
        return url;
      });
    }
  }
}
