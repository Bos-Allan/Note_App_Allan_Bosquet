import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NoteService } from '../note.service';
import { PhotoService } from '../photo.service';
import { Note } from '../models/note.model';
import { AlertController, ToastController } from '@ionic/angular';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  public modif: boolean = false;
  public note!: Note;
  public imageUrl: string | null = null;
  public imageUrls: string[] = [];

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private noteService: NoteService,
    public photoService: PhotoService,
    private router: Router,
    private storage: AngularFireStorage
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.noteService.getById(id).subscribe((value: any) => {
      this.note = value;
    });
  }

  //fonction pour modifier le bool modif a false
  setNoModif() {
    this.modif = false;
  }

  //alerte de confirmation avant modification
  async setModif() {
    if (!this.modif) {
      const alert = await this.alertCtrl.create({
        header: 'Etes vous sur de vouloir modifier ?',
        subHeader: 'Vous rendrez possible la modification',
        buttons: [
          {
            text: 'Annuler',
            role: 'Cancel',
          },
          {
            text: 'Oui',
            handler: () => {
              this.modif = !this.modif;
            },
          },
        ],
      });
      await alert.present();
    } else {
      this.modif = !this.modif;
    }
  }

  //appel de la fonction update du service noteService et toast apres modification et set bool modif a false + ajout des images
  onModif() {
    if (this.photoService.image) {
      for (let image of this.imageUrls) this.note.pictureLinks.push(image);
    }
    this.noteService.update(this.note).subscribe(() => {
      this.presentToast();
      this.modif = false;
    });
  }

  //alerte de confirmation avant suppression
  async setDelete(id: string | undefined) {
    const alert = await this.alertCtrl.create({
      header: 'Etes vous sur de vouloir supprimer ?',
      subHeader: 'Cette action est irréversible',
      buttons: [
        {
          text: 'Annuler',
          role: 'Cancel',
        },
        {
          text: 'Oui',
          handler: async () => {
            await this.onDelete(id);
          },
        },
      ],
    });
    await alert.present();
  }

  //appel de la fonction delete du service noteService et redirection vers la page home
  public onDelete(id: string | undefined) {
    this.noteService.delete(id);
    this.router.navigate(['/home']);
  }

  async presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Vos modifications sont enregistrées',
      duration: 2000,
    });
    (await toast).present();
  }

  //appel de la fonction delete du service noteService et redirection vers la page home

  //Recuperation de la methode takePicture du service photoService
  public async takePicture() {
    const imageUrl = await this.photoService.takePicture();
    this.imageUrls = [imageUrl];
  }

  //recuperation de l'url de l'image pour pouvoir supprimer l'image
  async deleteImage(fileUrl: string) {
    try {
      const fileRef = this.storage.storage.refFromURL(fileUrl); //utiliser refFromURL avec l'URL complète
      await fileRef.delete(); //supprimer l'image
      console.log(`Image supprimée : ${fileUrl}`);

      //supprime le chemin dans pictureLinks
      const index = this.note.pictureLinks.indexOf(fileUrl);
      if (index > -1) {
        this.note.pictureLinks.splice(index, 1);
      }

      //sauvegarde les modifications de la note
      await this.noteService.update(this.note).toPromise();
      console.log('Note mise à jour avec succès');
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
    }
  }
}
