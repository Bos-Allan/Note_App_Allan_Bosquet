import { PhotoService } from './../photo.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { NoteService } from '../note.service';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-new',
  templateUrl: './new.page.html',
  styleUrls: ['./new.page.scss'],
})
export class NewPage implements OnInit {
  public note: Note = new Note();
  public imageUrls: string[] = [];
  image: any;

  constructor(
    private noteService: NoteService,
    private photoService: PhotoService,
    private toastCtrl: ToastController,
    private router: Router
  ) { }

  ngOnInit() {
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Nouvelle Note enregistrée',
      duration: 2000
    });
    toast.present().then(() => {
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 2000);
    });
  }

  public async add() {
    //date actuelle
    this.note.date = new Date().toISOString();
    if (this.photoService.image) {
      for (let image of this.imageUrls)
      this.note.pictureLinks.push(image);
    }
    this.noteService.addNewNote(this.note).subscribe(() => {
      this.presentToast();
    });
  }

  public async takePicture() {
    const imageUrl = await this.photoService.takePicture();
    this.imageUrls = [imageUrl];

  }

}
