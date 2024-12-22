import { Component, OnInit } from '@angular/core';
import { NoteService } from '../note.service';
import { Router } from '@angular/router';
import { Note } from '../models/note.model';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.page.html',
  styleUrls: ['./to-do-list.page.scss'],
})
export class ToDoListPage implements OnInit {
  notes!: Array<Note>;

  constructor(private noteService: NoteService, private router: Router) {}

  //lister toutes les notes onInit
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
