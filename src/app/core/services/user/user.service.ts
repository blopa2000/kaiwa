import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { User, DefaultContact } from '@models/user.model';
import { of, BehaviorSubject, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<User>({});
  public user$ = this.user.asObservable();

  private userContact = new BehaviorSubject<DefaultContact | any>({});
  public userContact$ = this.userContact.asObservable();

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

  getUser(id: string): Subscription {
    return this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .subscribe((doc: any) => {
        this.user.next({ ...doc, id });
      });
  }

  updateUser(user: any, id: string): void {
    this.db.collection('users').doc(id).update(user);
  }

  addContact(id: string, contact: object): void {
    this.db.collection('users').doc(id).collection('contacts').add(contact);
  }

  getContacts(id: string): Observable<any> {
    if (id) {
      return this.db
        .collection('users')
        .doc(id)
        .collection('contacts')
        .snapshotChanges();
    }
    return of(null);
  }

  validateMyContacts(id: string): Observable<any> {
    return this.db
      .collection('users')
      .doc(id)
      .collection('contacts')
      .valueChanges();
  }

  getUserContact(id: string): Observable<any> {
    return this.db.collection('users').doc(id).valueChanges();
  }

  setUserContact(id: string, idContact: string): void {
    this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .subscribe((doc) => {
        this.userContact.next({ doc, idContact, id });
      });
  }

  deleteContacts(
    idCollectionContact: string,
    idUserContact: string,
    idUser: string
  ): void {
    this.userContact.next({});

    // remove user from my contacts
    this.db
      .collection('users')
      .doc(idUser)
      .collection('contacts')
      .doc(idCollectionContact)
      .delete();

    // remove my user from the other user's array
    this.db
      .collection('users')
      .doc(idUserContact)
      .collection('contacts', (ref) => ref.where('user', '==', idUser))
      .get()
      .subscribe((doc) => {
        if (doc.docs[0]?.id) {
          this.db
            .collection('users')
            .doc(idUserContact)
            .collection('contacts')
            .doc(doc.docs[0].id)
            .delete();
        }
      });
  }

  searchUsers(user: string): Observable<any> {
    return this.db
      .collection('users', (ref) =>
        ref
          .where('firstName', '>=', user)
          .where('firstName', '<=', user + '\uf8ff')
      )
      .get();
  }
}
