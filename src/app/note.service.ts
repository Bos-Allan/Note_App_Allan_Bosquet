import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Note } from './models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private dbPath = '/notes';
  notesRef: AngularFirestoreCollection<Note>;

  constructor(private db: AngularFirestore) {
    this.notesRef = db.collection(this.dbPath);
  }

  getAll(): Observable<Note[]> {
    return this.notesRef.valueChanges({ idField: 'id' }) as Observable<Note[]>;
  }

  add(note: Note): Promise<void> {
    const id = this.db.createId(); //Pour id
    return this.notesRef.doc(id).set({ ...note, id });
  }

}
