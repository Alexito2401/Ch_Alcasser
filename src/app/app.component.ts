import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private so: ScreenOrientation) {
    this.so.lock(this.so.ORIENTATIONS.PORTRAIT);
  }
}
