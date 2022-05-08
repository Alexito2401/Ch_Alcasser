import { Injectable, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as firebase from 'firebase/compat/app';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import imageCompression from 'browser-image-compression';
import { Jugador } from 'src/app/interfaces/usuario';
import { NavigationEnd, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = '/profiles';
  fb;
  downloadURL: Observable<string>;
  private previousUrl: string;
  private currentUrl: string;
  currentUser: firebase.default.User = null;

  constructor(private afAuth: AngularFireAuth,
    private storage: AngularFireStorage, private afs: AngularFirestore, private router: Router) {

    this.afAuth.authState.subscribe((user) => (this.currentUser = user))

    this.currentUrl = this.router.url;
    router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.previousUrl = this.currentUrl;
        this.currentUrl = event.url;
      };
    });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  setUser(user: firebase.default.User) {
    this.currentUser = user;
    console.log(this.currentUser);

  }

  getUser() {
    return this.currentUser;
  }

  public currentUserFireStore() {
    return this.afs.collection('users').doc<Jugador>(this.currentUser.uid).get();
  }

  public tareaCloudStorage(nombreArchivo: string, datos: any) {
    return this.storage.upload(nombreArchivo, datos);
  }

  public referenciaCloudStorage(nombreArchivo: string) {
    return this.storage.ref(`profiles/${nombreArchivo}`);
  }

  async onFileSelect(event: Event, uid: string) {

    if (!event) { return; }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    }

    const compressedFile = await imageCompression(event.target['files'][0], options);

    const filePath = `${this.basePath}/${uid}`;
    const fileRef = this.storage.ref(filePath);
    const upload = this.storage.upload(filePath, compressedFile);

    upload.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL();
        this.downloadURL.subscribe(async url => {
          if (url) {
            this.fb = url;

            (await this.currentUser).updateProfile({
              photoURL: url
            })
          }
          console.log(this.fb);
        })
      })
    ).subscribe(url => {
      if (url) {
        console.log(url)
      }
    })
  }

  getUserIamge = async (uid: string) => {
    return await firebase.default.storage().ref().child(`profiles/${uid}`).getDownloadURL();
  }
}

export class Upload {
  key: string;
  name: string;
  url: string;
  file: File;
  progress: number;
  constructor(file: File) {
    this.file = file;
  }
}
