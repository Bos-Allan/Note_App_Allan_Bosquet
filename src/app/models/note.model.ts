export class Note {
  id?: string;
  title: string;
  message:string;
  pictureLink:string;
  date:string;

  constructor(){
    this.title = '';
    this.message = '';
    this.pictureLink = '';
    this.date = '';
  }
}
