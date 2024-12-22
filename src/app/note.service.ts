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

  getById(id: any): any {
    return new Observable(obs => {
      this.notesRef.doc(id).get().subscribe(res => {
        obs.next({ id: res.id, ...res.data() });
      });
    });
  }

  addNewNote(note: Note): any {
    return new Observable(obs => {
      this.notesRef.add({ ...note }).then(() => {
        obs.next();
      });
    });
  }

  update(note: Note) {
    return new Observable(obs => {
      this.notesRef.doc(note.id).update(note);
      obs.next();
    });
  }

  delete(id: any) {
    this.db.doc(`notes/${id}`).delete();
  }
}
