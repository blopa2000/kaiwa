import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  id: string = '';
  contacts: any[] = [];
  todos: any = [];

  constructor(private db: AngularFirestore) {}

  createUser(
    firstName: string,
    lastName: string,
    email: string,
    id: string
  ): void {
    this.db.collection('users').doc(id).set({ firstName, lastName, email });
  }

  getUser(id: string): any {
    this.id = id;
    return this.db.collection('users').doc(id).valueChanges();
  }

  getContacts(): any {
    if (this.id) {
      return this.db
        .collection('users')
        .doc(this.id)
        .collection('contacts')
        .valueChanges();
    }
    return of(null);
  }

  getUserContact(id: string): any {
    return this.db.collection('users').doc(id).valueChanges();
  }
}
