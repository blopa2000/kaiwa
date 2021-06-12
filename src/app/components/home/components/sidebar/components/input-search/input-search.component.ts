import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';
import { Contacts, DefaultContact, User } from '@models/user.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
})
export class InputSearchComponent implements OnInit, OnDestroy {
  private unsubscribe$ = new Subject<void>();

  search: FormControl;
  listUsers: DefaultContact[];
  listContacts: Contacts[];
  idUser: string;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) {
    this.search = new FormControl();

    this.userService.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc: User) => {
        this.idUser = doc.id;
        this.userService
          .validateMyContacts(doc.id)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((contacts: Contacts[]) => {
            this.listContacts = contacts;
          });
      });
  }

  ngOnInit(): void {
    this.search.valueChanges
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((doc) => {
        this.userService
          .searchUsers(doc)
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe((data) => {
            this.listUsers = [];
            for (const user of data.docs) {
              this.listUsers.push({ doc: user.data(), id: user.id });
            }
          });
      });
  }

  addContacts(id: string): void {
    const findUser = this.listContacts.find((doc) => doc.user === id);

    if (id !== this.idUser && findUser === undefined) {
      const room = {
        countMessage: 0,
        idUser: '',
        lastMessage: '',
        messageSeen: true,
        timestamp: new Date(),
      };
      this.roomService.createRoom(room).then((doc) => {
        const contact = {
          user: id,
          room: doc.id,
        };
        this.userService.addContact(this.idUser, contact);
        this.search.reset();
      });
    } else {
      this.openSnackBar('Error cannot create a chat room', 'dismiss');
    }
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
  }
}
