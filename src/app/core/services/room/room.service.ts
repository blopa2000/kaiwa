import { Message, LastMessage } from '@models/room.model';
import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  throwError,
} from 'rxjs';
import { catchError, map, retry, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  id: string;
  private unsubscribe$ = new Subject<void>();

  private message = new BehaviorSubject<Message[]>([]);
  public message$ = this.message.asObservable();

  private lastMessage = new BehaviorSubject<LastMessage>(null);
  public lastMessage$ = this.lastMessage.asObservable();

  private ID = new BehaviorSubject<string>('');
  public ID$ = this.ID.asObservable();

  private view = new BehaviorSubject<string>('start');
  public view$ = this.view.asObservable();

  constructor(private db: AngularFirestore) {}

  createRoom(room: object): Promise<DocumentReference> {
    return this.db.collection('room').add(room);
  }

  getRoom(id: string): Observable<unknown> {
    return this.db.collection('room').doc(id).valueChanges();
  }

  deleteRoom(): Promise<void> {
    this.ID.next('');
    this.message.next([]);

    this.db
      .collection('room')
      .doc(this.id)
      .collection('messages')
      .snapshotChanges()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc) => {
        for (const data of doc) {
          data.payload.doc.ref.delete();
        }
      });
    return this.db.collection('room').doc(this.id).delete();
  }

  getMessage(id: string): Subscription {
    this.id = id;
    this.ID.next(id);
    this.view.next('chat');
    return this.db
      .collection('room')
      .doc(id)
      .collection('messages', (ref) =>
        ref.orderBy('timestamp', 'desc').limit(20)
      )
      .snapshotChanges()
      .pipe(
        retry(3),
        catchError((error) => {
          return throwError('error when fetching messages');
        }),
        map((messages) => {
          const chats = [];
          for (const message of messages) {
            chats.unshift(message);
          }
          return chats;
        })
      )
      .subscribe((doc) => {
        const messages = [];
        for (const msg of doc) {
          messages.push({
            ...msg.payload.doc.data(),
            id: msg.payload.doc.id,
          });
        }

        this.message.next(messages);
      });
  }

  messageRead(id: string): void {
    this.db.collection('room').doc(id).update({
      messageSeen: true,
      countMessage: 0,
    });
  }

  newMessage(msg: any): Promise<DocumentReference> {
    return this.db
      .collection('room')
      .doc(this.id)
      .collection('messages')
      .add(msg);
  }

  updateLastMessage(msg: any): Promise<void> {
    return this.db.collection('room').doc(this.id).update(msg);
  }

  getLastMessage(id: string): void {
    this.db
      .collection('room')
      .doc(id)
      .valueChanges()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc: LastMessage) => {
        this.lastMessage.next(doc);
      });
  }

  cleanChat(): Subscription {
    this.db.collection('room').doc(this.id).update({ lastMessage: 'Kaiwa :)' });

    return this.db
      .collection('room')
      .doc(this.id)
      .collection('messages')
      .snapshotChanges()
      .subscribe((doc) => {
        for (const data of doc) {
          data.payload.doc.ref.delete();
        }
      });
  }

  deleteMessage(idMsg: string): void {
    this.db
      .collection('room')
      .doc(this.id)
      .collection('messages')
      .doc(idMsg)
      .delete();
  }

  changeView(state: string): void {
    this.view.next(state);
  }

  clean(): void {
    this.message.next([]);
    this.ID.next('');
    this.lastMessage.next(null);
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
