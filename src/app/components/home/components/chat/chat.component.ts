import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  DoCheck,
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

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, DoCheck {
  @ViewChild('containerMessage', { static: false })
  private containerMessage: ElementRef;

  messages = [];
  count: any = 0;
  user: any = {};
  userContact: any = {};
  listContacts: any[];
  idRoom: any = '';
  idUser: string = '';
  messageInput: FormControl;
  view: string = 'start';

  //icon
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

    this.roomService.message$.subscribe((msg) => {
      this.messages = msg;
    });

    this.userService.user$.subscribe((user) => {
      this.user = user;
    });

    this.roomService.ID$.subscribe((id) => {
      this.idRoom = id;
    });

    this.userService.userContact$.subscribe((doc) => {
      this.userContact = doc;
      this.userService.validateMyContacts(doc.id).subscribe((doc) => {
        this.listContacts = doc;
      });
    });

    this.roomService.view$.subscribe((data) => {
      this.view = data;
    });
  }

  ngOnInit(): void {}

  ngDoCheck() {
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

  async handleMessage() {
    if (!this.messageInput.hasError('required')) {
      try {
        this.roomService.getLastMessage().subscribe((doc: any) => {
          this.count = doc?.countMessage;
          this.idUser = doc?.idUser;
        });

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

  deleteMessage(id: string) {
    this.roomService.deleteMessage(id);
  }

  changeView(state) {
    this.roomService.changeView(state);
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
