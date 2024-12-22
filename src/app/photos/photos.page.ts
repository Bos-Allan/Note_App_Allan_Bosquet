import { Capacitor } from '@capacitor/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoService } from './../photo.service';
import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  image: any;
  imageUrl: string | null = null;
  imageUrls: string[] = [];

  constructor(
    public photoService: PhotoService,
    private storage: AngularFireStorage,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // this.getImage();
    this.listImages();
  }

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

      this.imageUrls.push(url);

    } catch (e) {
      console.log('error', e);
    }
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Nouvelle image enregistrée',
      duration: 2000
    });
    toast.present().then(() => {
      setTimeout(() => {
        window.location.reload();;
      }, 2000);
    });
  }



  private dataURLtoBlob(dataurl: any) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
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

  async listImages() {
    const folderPath = 'noteImage/';
    const folderRef = this.storage.ref(folderPath);

    try {
      const res = await folderRef.listAll().toPromise();
      for (let itemRef of res!.items) {
        const url = await itemRef.getDownloadURL();
        this.imageUrls.push(url);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des images:', error);
    }
  }

  async deleteImage(fileUrl: string) {
    try {
      const fileRef = this.storage.storage.refFromURL(fileUrl); // Utilise refFromURL avec l'URL complète
      await fileRef.delete(); // Supprime l'image
      console.log(`Image supprimée : ${fileUrl}`);

      // Mettre à jour la liste des images après suppression
      this.imageUrls = this.imageUrls.filter((url) => url !== fileUrl);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'image:', error);
    }
  }



}
