import { Component } from '@angular/core';
import { NoteService } from '../note.service';
import { Note } from '../models/note.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  notes!: Array<Note>;

  constructor(private noteService: NoteService, private router: Router) {}

  //lister les notes onInit
  ngOnInit(): void {
    this.noteService.getAll().subscribe((data) => {
      this.notes = data;
    });
  }

  onDelete(id: any) {
    this.noteService.delete(id);
    this.router.navigate(['/films']);
  }

}
