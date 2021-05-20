import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

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
    public dialog: MatDialog,
    private snackBar: MatSnackBar
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
        try {
          this.userService.deleteContacts(
            this.user.idContact,
            this.user.id,
            this.idUser
          );
          this.roomService.deleteRoom();
        } catch (error) {
          this.openSnackBar('error trying to delete user', 'dismiss');
        }
      }
    });
  }

  cleanChat() {
    try {
      const res = this.roomService.cleanChat();

      setTimeout(() => {
        res.unsubscribe();
      }, 200);
    } catch (error) {
      this.openSnackBar('error cleaning chat', 'dismiss');
    }
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
