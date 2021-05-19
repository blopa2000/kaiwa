import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<any>({});
  public user$ = this.user.asObservable();

  private userContact = new BehaviorSubject<any>({});
  public userContact$ = this.userContact.asObservable();
  public id = '';

  constructor(private db: AngularFirestore) {}

  createUser(
    firstName: string,
    lastName: string,
    email: string,
    id: string
  ): void {
    this.db
      .collection('users')
      .doc(id)
      .set({ firstName, lastName, email, description: 'new to kaiwa :)' });
  }

  getUser(id: string): any {
    this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .subscribe((doc: any) => {
        this.user.next({ ...doc, id });
      });
  }

  getContacts(id: string): any {
    if (id) {
      return this.db
        .collection('users')
        .doc(id)
        .collection('contacts')
        .valueChanges();
    }
    return of(null);
  }

  getUserContact(id: string): any {
    return this.db.collection('users').doc(id).valueChanges();
  }

  setUserContact(id: string) {
    this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .subscribe((doc) => {
        this.userContact.next(doc);
      });
  }
}
