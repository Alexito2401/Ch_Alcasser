import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { UserService } from 'src/app/services/user.service';

interface Patrocinador {
  nombre: string;
  foto: string;
  linkTo?: string;
  descripcion: string;
}

@Component({
  selector: 'app-patrocinadores',
  templateUrl: './patrocinadores.page.html',
  styleUrls: ['./patrocinadores.page.scss'],
})
export class PatrocinadoresPage implements OnInit {

  patrocinadoresList: Patrocinador[] = [
    {
      nombre: 'Argo Fotografia',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2021/12/argofotografia.jpg?w=300',
      linkTo: 'argofotografia',
      descripcion: "ARGOFOTOGRAFIA és una xicoteta empresa encarregada de gestionar les xarxes socials del Club Handbol Alcàsser. Són especialistes en fotografia esportiva, però també tenen l’equip necessari per a realitzar vídeos, o dissenyar contingut gràfic per a webs o xarxes socials."
    },
    {
      nombre: 'Turdiesel',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2015/10/TURDIESEL.gif',
      descripcion: 'Turdiesel es va establir com a taller especialitzat en reparació de Sistemes d’Injecció Dièsel i Turbos, amb un equip professional de més de vint anys d’experiència, ràpidament s’incorpora a la xarxa Bosch Car Service, sent un important referent , en la Comunitat Valenciana'
    },
    {
      nombre: 'Proyecsa',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2015/10/logo-proyecsa-xxis.l..png?w=180',
      descripcion: 'Construccions Proyecsa XXI, S.L. és una empresa jove i dinàmica amb personal qualificat i resolutiu. Aquesta empresa es dedica a la construcció, reformes i retirada d’amiant.'
    },
    {
      nombre: 'INDEREN',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2021/12/c1640417-dc58-4435-9984-1ffe53ea7886.jpg?w=300',
      descripcion: 'INDEREN és una empresa amb una important capacitat tècnica i amb una àmplia experiència en el camp de les instal·lacions industrials, dedicada a la promoció i desenvolupament d’energies renovables, especialment sensibilitzada amb el medi ambient.'
    },
    {
      nombre: 'Decoraciones Gopi',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2021/12/LOGO-GOPI.jpg?w=355',
      descripcion: 'La teua botiga de pintures i decoració a Silla i Picassent. Som una Empresa innovadora i responsable, especialitzada en pintura industrial i decoració. Amb més de 20 anys d’experiència en el sector.',
      linkTo: 'decoraciones_gopi'
    },
    {
      nombre: 'Kallpa',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2021/12/image001.png?w=250',
      descripcion: 'Especialistes en muntatge d’estructures prefabricades de formigó en les obres més importants realitzades en els últims anys a Espanya i part de l’estranger. Aconseguint una altíssima valoració i reconeixement dins del sector del prefabricat.'
    },
    {
      nombre: 'San Ramón Senior',
      foto: 'https://i0.wp.com/chalcasser.es/wp-content/uploads/2021/12/8e7dd051-6be3-4e6e-aa9c-4cfc746298d0-1.jpg?w=1600',
      descripcion: 'Sant Ramon Senior S.L., a Picassent, la teva millor opció quan es tracta de RESIDÈNCIES PER A PERSONES MAJORS. La nostra manera d’aconseguir l’excel·lència és dedicant als nostres usuaris tota la nostra experiència en el sector. La claredat, el tracte personal i el compromís són essencials en la nostra manera de conducta. Estem preparats per a ser el teu servei de RESIDÈNCIES PER A PERSONES MAJORS a Picassent.'
    },
  ]
  constructor(private platform: Platform, private inAppBrowser: InAppBrowser, private appAvailability: AppAvailability) {

  }

  ngOnInit() {
  }

  goTo(name: string) {
    if (!name) {
      return;
    }
    let app;
    if (this.platform.is('ios')) {
      app = 'instagram://';
    } else if (this.platform.is('android')) {
      app = 'com.instagram.android';
    } else {
      this.openInApp('https://www.instagram.com/' + name);
      return;
    }
    this.appAvailability.check(app)
      .then((res) => {
        this.openInApp('instagram://user?username=' + name);
      }
      ).catch(err => {
        this.openInApp('https://www.instagram.com/' + name);
      });
  }

  openInApp(url) {
    this.inAppBrowser.create(url, '_system')
  }

}
