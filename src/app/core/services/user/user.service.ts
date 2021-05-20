import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { of, BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private user = new BehaviorSubject<any>({});
  public user$ = this.user.asObservable();

  private userContact = new BehaviorSubject<any>({});
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

  getUser(id: string): any {
    this.db
      .collection('users')
      .doc(id)
      .valueChanges()
      .subscribe((doc: any) => {
        this.user.next({ ...doc, id });
      });
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

  getUserContact(id: string): Observable<any> {
    return this.db.collection('users').doc(id).valueChanges();
  }

  setUserContact(id: string, idContact: string) {
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
  ) {
    this.userContact.next({});

    //remove user from my contacts
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
}
