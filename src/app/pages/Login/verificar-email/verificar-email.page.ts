import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertController } from '@ionic/angular';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verificar-email',
  templateUrl: './verificar-email.page.html',
  styleUrls: ['./verificar-email.page.scss'],
})
export class VerificarEmailPage implements OnInit {

  disable = false;

  constructor(private afAuth: AngularFireAuth, private authService: AuthService, private alertController: AlertController) { }

  ngOnInit() {
  }

  async sendEmail() {
    const user = await (this.afAuth.currentUser);
    if (user) {
      await (await (this.afAuth.currentUser)).sendEmailVerification()
        .then(() => {
          this.disable = true;
          this.authService.presentToast(`Se ha enviado el correo de verificacion a ${user['email']}`, "Verificacion");
          setTimeout(() => {
            this.disable = false;
          }, 5000)
        }).catch(err => {
          console.log(err)
          this.authService.codigoErrores(err.code, this.alertController);
        })
        ;
    } else {
      this.authService.presentToast("Ha ocurrido un error, intentelo de nuevo", "Error");
    }
  }
}
