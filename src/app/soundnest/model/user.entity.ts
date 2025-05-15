export class User {
  id: number;
  name: string;
  email: string;
  password: string;
  isOwner: boolean;

  constructor(user: {id?: number, name?:string, email?: string, password?:string, isOwner?: boolean}) {
    this.id = user.id || 0;
    this.name = user.name || ' ';
    this.email = user.email || ' ';
    this.password = user.password || ' ';
    this.isOwner = user.isOwner|| false;
  }
}
