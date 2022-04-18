import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../environments/environment';
import { UserService } from '../../../services/user.service';
import { ValidatorsService } from '../../../services/validators.service';
import { Router } from '@angular/router';

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


  constructor(public fb: FormBuilder,
    private userService: UserService,
    private vs: ValidatorsService,
    private router: Router
  ) {
    // Reactive Form
    this.uploadForm = this.fb.group({
      avatar: [null],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: [this.vs.camposIguales('password', 'confirmPassword')]
    })
  }

  ngOnInit() {
    console.log(this.userService.CurrentUser)
  }

  get password() {
    return this.uploadForm.get('password')
  }
  get confirmPassword() {
    return this.uploadForm.get('confirmPassword')
  }

  guardarInfoFirebase() {

    this.userService.CurrentUserPromise.then(user => {
      user.updatePassword(this.password.value);
      this.userService.onFileSelect(this.event, user.uid);

    }).then(() => this.router.navigateByUrl('partidos/partidos', { replaceUrl: true }))
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


