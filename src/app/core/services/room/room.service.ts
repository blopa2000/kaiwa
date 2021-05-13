import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  id = '';
  private message = new BehaviorSubject<any[]>([]);
  public message$ = this.message.asObservable();

  private ID = new BehaviorSubject<string>('');
  public ID$ = this.ID.asObservable();

  constructor(private db: AngularFirestore) {}

  getRoom(id: string): any {
    return this.db.collection('room').doc(id).valueChanges();
  }

  getMessage(id: string) {
    this.id = id;
    this.ID.next(id);
    return this.db
      .collection('room')
      .doc(id)
      .collection('messages', (ref) => ref.orderBy('timestamp', 'asc'))
      .valueChanges()
      .subscribe((doc) => {
        this.message.next(doc);
      });
  }

  async messageRead(id: string) {
    this.db.collection('room').doc(id).update({
      messageSeen: true,
      countMessage: 0,
    });
  }

  newMessage(msg: any) {
    return this.db
      .collection('room')
      .doc(this.id)
      .collection('messages')
      .add(msg);
  }

  lastMessage(msg: any) {
    return this.db.collection('room').doc(this.id).update(msg);
  }

  getCountMessage() {
    return this.db.collection('room').doc(this.id).valueChanges();
  }
}
