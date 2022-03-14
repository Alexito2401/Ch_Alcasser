import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
})
export class RegistrarsePage implements OnInit {

  credentialForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.credentialForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    })
  }

  get email() {
    return this.credentialForm.get('email')
  }

  get password() {
    return this.credentialForm.get('password')
  }
  get confirmPassword() {
    return this.credentialForm.get('confirmPassword')
  }
  get username() {
    return this.credentialForm.get('username')
  }


}
