import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  DoCheck,
  OnDestroy,
} from '@angular/core';
import { RoomService } from '@services/room/room.service';
import { UserService } from '@services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  faPaperPlane,
  faChevronDown,
  faArrowLeft,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

import { FormControl, Validators } from '@angular/forms';
import { User, DefaultContact, Contacts } from '@models/user.model';
import { Message } from '@models/room.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('containerMessage', { static: false })
  private containerMessage: ElementRef;

  private unsubscribe$ = new Subject<void>();

  count = 0;
  view = 'start';
  idRoom: string;
  idUser: string;
  user: User;
  messages: Message[];
  userContact: DefaultContact;
  listContacts: Contacts[];
  messageInput: FormControl;

  // icon
  faPaperPlane = faPaperPlane;
  faChevronDown = faChevronDown;
  faArrowLeft = faArrowLeft;
  faUserCircle = faUserCircle;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private snackBar: MatSnackBar,
    private el: ElementRef
  ) {
    this.messageInput = new FormControl('', [Validators.required]);

    this.roomService.message$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((msg: Message[]) => {
        this.messages = msg;
      });

    this.userService.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user: User) => {
        this.user = user;
      });

    this.roomService.ID$.pipe(takeUntil(this.unsubscribe$)).subscribe(
      (id: string) => {
        this.idRoom = id;
      }
    );

    this.userService.userContact$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc: DefaultContact) => {
        this.userContact = doc;
        this.userService
          .validateMyContacts(doc.id)
          .subscribe((contacts: Contacts[]) => {
            this.listContacts = contacts;
          });
      });

    this.roomService.view$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data: string) => {
        this.view = data;
      });

    this.roomService.lastMessage$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc) => {
        this.count = doc?.countMessage;
        this.idUser = doc?.idUser;
      });
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
    if (window.innerWidth < 950) {
      if (this.view === 'chat') {
        this.el.nativeElement.style.display = 'block';
      } else {
        this.el.nativeElement.style.display = 'none';
      }
    }

    if (this.messages.length > 0) {
      this.containerMessage.nativeElement.scrollTop =
        this.containerMessage.nativeElement.scrollHeight;
    }
  }

  async handleMessage(): Promise<void> {
    if (!this.messageInput.hasError('required')) {
      try {
        const message = this.messageInput.value;

        this.messageInput.reset();

        const msg = {
          message,
          idUser: this.user.id,
          timestamp: new Date(),
        };

        const lastMessage = {
          lastMessage: message,
          idUser: this.user.id,
          timestamp: new Date(),
          messageSeen: false,
          countMessage: this.idUser === this.user.id ? this.count + 1 : 1,
        };

        await this.roomService.newMessage(msg);
        await this.roomService.updateLastMessage(lastMessage);

        /**
         *
         * in this part my identification is added to the other
         * user to make the link to the chat
         *
         */
        if (this.messages.length <= 1) {
          const find = this.listContacts.find(
            (doc) => doc.user === this.user.id
          );

          if (find === undefined) {
            const contact = {
              room: this.idRoom,
              user: this.user.id,
            };

            this.userService.addContact(this.userContact.id, contact);
          }
        }
      } catch (response: any) {
        this.openSnackBar('Error trying to send the message', 'dismiss');
      }
    }
  }

  deleteMessage(id: string): void {
    this.roomService.deleteMessage(id);
  }

  changeView(state: string): void {
    this.roomService.changeView(state);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.idRoom = '';
    this.messages = [];
    this.roomService.clean();
  }
}
