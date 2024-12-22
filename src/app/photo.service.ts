import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource, Photo } from '@capacitor/camera';
import { Note } from './models/note.model';
import { Capacitor } from '@capacitor/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class PhotoService {
  image: any;


  constructor(private storage: AngularFireStorage) { }

  public async takePicture() {
    try {
      if (Capacitor.getPlatform() !== 'web') await Camera.requestPermissions();
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        source: CameraSource.Prompt,
        resultType: CameraResultType.DataUrl,
      });
      console.log('image', image);
      this.image = image.dataUrl;
      const blob = this.dataURLtoBlob(this.image);
      const url = await this.uploadImage(blob, image);
      console.log('url: ', url);
      return url;
    } catch (e) {
      console.log('error', e);
    }
  }

  private dataURLtoBlob(dataUrl: any) {
    var arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  }

  private async uploadImage(blob: any, imageData: any) {
    try {
      const currentDate = Date.now();
      const filePath = `noteImage/${currentDate}.${imageData.format}`;
      const fileRef = this.storage.ref(filePath);

      // Uploader le fichier
      const task = await this.storage.upload(filePath, blob);

      // Obtenir l'URL de téléchargement
      const url = await fileRef.getDownloadURL().toPromise();
      return url;
    } catch (e) {
      throw e;
    }
  }

}


