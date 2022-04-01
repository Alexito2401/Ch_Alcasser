import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.page.html',
  styleUrls: ['./verificar-email.page.scss'],
})
export class VerificarEmailPage implements OnInit {

  disable = false;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService) { }

  ngOnInit() {
  }

  async sendEmail() {
    this.disable = true;
    await (await (this.afAuth.currentUser)).sendEmailVerification().then(() => {
      this.authService.presentToast("Se ha enviado el correo de verificacion", "Verificacion");
    });
  }
}
