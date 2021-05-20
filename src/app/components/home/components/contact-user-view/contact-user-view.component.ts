import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogContactComponent } from './../dialog-contact/dialog-contact.component';

import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';

@Component({
  selector: 'app-contact-user-view',
  templateUrl: './contact-user-view.component.html',
  styleUrls: ['./contact-user-view.component.scss'],
})
export class ContactUserViewComponent {
  user: any = undefined;

  idUser: string = '';

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    public dialog: MatDialog
  ) {
    this.userService.userContact$.subscribe((doc) => {
      this.user = doc;
    });

    this.userService.user$.subscribe((doc) => {
      this.idUser = doc.id;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContactComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userService.deleteContacts(
          this.user.idContact,
          this.user.id,
          this.idUser
        );
        this.roomService.deleteRoom();
      }
    });
  }
}
