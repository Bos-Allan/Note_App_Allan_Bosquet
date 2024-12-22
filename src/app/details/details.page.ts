
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
  modif: boolean = false;
  note!: Note;
  imageUrl: string | null = null;

  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private route: ActivatedRoute,
    private noteService: NoteService,
    public photoService: PhotoService,
    private router: Router,
    private storage: AngularFireStorage
  ) { }

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    this.noteService.getById(id).subscribe((value: any) => {
      this.note = value;
    });
  }

  setNoModif() {
    this.modif = false;
  }

  async setModif() {
    if(!this.modif) {
      const alert = await this.alertCtrl.create({
        header : 'Etes vous sur de vouloir modifier ?',
        subHeader: 'Vous rendrez possible la modification',
        buttons : [
          {
            text: 'Annuler',
            role: 'Cancel'
          }, {
            text: 'Oui',
            handler: () => {this.modif = !this.modif}
          }
        ]
      });
      await alert.present();
    } else {
      this.modif = !this.modif;
    }
  }


  async presentToast() {
    const toast = this.toastCtrl.create({
      message: 'Vos modifications sont enregistrées',
      duration: 2000
    });
    (await toast).present();
  }


  onModif() {
    this.noteService.update(this.note).subscribe(() => {
      this.presentToast();
      this.modif = false;
    });
  }
  onDelete(id: any) {
    this.noteService.delete(id);
    this.router.navigate(['/home']);
  }


  async getImage(filePath: string) {
    const fileRef = this.storage.ref(filePath);
    try{
      const url = await fileRef.getDownloadURL().toPromise();
      return url;
    }catch(e) {
      console.log('error', e);
      return '';
    }


  }


}
