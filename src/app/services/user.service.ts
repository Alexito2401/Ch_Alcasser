import { Injectable, Input } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import * as firebase from 'firebase/compat';
import { finalize } from 'rxjs/operators';
import { Observable } from 'rxjs';
import imageCompression from 'browser-image-compression';
import { profile } from 'console';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private basePath = '/profiles';
  private UploadTask: firebase.default.storage.UploadTask
  fb;
  downloadURL: Observable<string>;

  constructor(private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storage: AngularFireStorage) { }


  get CurrentUser(): Promise<firebase.default.User> {
    return this.afAuth.currentUser.then(user => {
      return user;
    })
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

            (await this.CurrentUser).updateProfile({
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
