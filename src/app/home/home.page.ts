import { Component } from '@angular/core';
import { NoteService } from '../note.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  notes!: any;

  constructor(private Note: NoteService) {}

  ngOnInit(): void {
    this.Note.getAll().subscribe((data) => {
      this.notes = data;
    });
  }

}
