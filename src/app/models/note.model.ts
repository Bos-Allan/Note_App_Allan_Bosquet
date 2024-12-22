export class Note {
  id?: string;
  title: string;
  message:string;
  pictureLinks: string[];
  date:string;

  constructor(){
    this.title = '';
    this.message = '';
    this.pictureLinks = [];
    this.date = '';
  }
}
