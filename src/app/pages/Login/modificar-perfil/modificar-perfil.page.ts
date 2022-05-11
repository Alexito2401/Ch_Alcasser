import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import * as firebase from 'firebase/compat/app';
import { filter } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { ValidatorsService } from '../../../services/validators.service';
import { Posicion } from '../../../interfaces/usuario';

@Component({
  selector: 'app-modificar-perfil',
  templateUrl: './modificar-perfil.page.html',
  styleUrls: ['./modificar-perfil.page.scss'],
})
export class ModificarPerfilPage implements OnInit {

  @ViewChild('fileDialog') FileSelectInputDialog: ElementRef
  imageURL;
  uploadForm: FormGroup;
  categorias = environment.categorias;
  event: Event;
  posiciones: typeof Posicion = Posicion;
  goTo: string;


  constructor(public fb: FormBuilder,
    private userService: UserService,
    private vs: ValidatorsService,
    private router: Router
  ) {
    // Reactive Form

  }

  ngOnInit() {
    if (this.userService.getPreviousUrl() != '/') {
      this.uploadForm = this.fb.group({
        avatar: [null],
        password: ['', [Validators.minLength(6)]],
        confirmPassword: ['', [Validators.minLength(6)]],
        posicion: [null]
      }, {
        validators: [this.vs.camposIguales('password', 'confirmPassword')]
      })

      this.goTo = this.userService.getPreviousUrl();
    } else {
      this.uploadForm = this.fb.group({
        avatar: [null],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        posicion: [null]
      }, {
        validators: [this.vs.camposIguales('password', 'confirmPassword')]
      })

      this.goTo = 'partidos/partidos';
    }

    firebase.default.auth().onAuthStateChanged(user => {
      this.imageURL = user.photoURL
    })
  }

  get password() {
    return this.uploadForm.get('password')
  }
  get confirmPassword() {
    return this.uploadForm.get('confirmPassword')
  }
  get updatePosicion() {
    return this.uploadForm.get('posicion')
  }

  guardarInfoFirebase() {
    console.log(this.updatePosicion);

    const user = this.userService.getUser();
    user.updatePassword(this.password.value);
    this.userService.onFileSelect(this.event, user.uid);
    this.userService.cambiarPosicionJugador(this.updatePosicion.value)

    this.router.navigateByUrl(this.goTo, { replaceUrl: true })
  }



  cambiarImagen() {
    const e: HTMLElement = this.FileSelectInputDialog.nativeElement;
    e.click();

    e.addEventListener('change', async (event: Event) => {
      this.event = event;
      const reader = new FileReader();

      reader.onloadend = (() => {
        this.imageURL = reader.result;
      });

      event.target['files'][0] ? reader.readAsDataURL(event.target['files'][0]) : this.imageURL = ""
    });
  }
}


