import { Component, OnInit } from '@angular/core';
import { RoomService } from '@services/room/room.service';
import { UserService } from '@services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  messages = [];
  count: any = 0;
  user: any = {};
  idRoom: any = '';
  messageInput: FormControl;

  constructor(
    private roomService: RoomService,
    private userService: UserService,
    private snackBar: MatSnackBar
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
  }

  ngOnInit(): void {}

  async handleMessage() {
    if (!this.messageInput.hasError('required')) {
      this.roomService.getCountMessage().subscribe((doc: any) => {
        this.count = doc.countMessage;
      });
      const message = this.messageInput.value;
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
        countMessage: this.count + 1,
      };
      try {
        await this.roomService.newMessage(msg);
        await this.roomService.lastMessage(lastMessage);
        this.messageInput.reset();
      } catch (response: any) {
        this.openSnackBar(response.message, 'dismiss');
      }
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
