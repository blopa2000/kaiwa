import { Component, DoCheck, ElementRef, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { DialogContactComponent } from './../dialog-contact/dialog-contact.component';

import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';
import { DefaultContact, User } from '@models/user.model';

@Component({
  selector: 'app-contact-user-view',
  templateUrl: './contact-user-view.component.html',
  styleUrls: ['./contact-user-view.component.scss'],
})
export class ContactUserViewComponent implements DoCheck, OnDestroy {
  user: DefaultContact;
  view: string;
  idUser: string;

  userContactSub: any;

  // icon
  faArrowLeft = faArrowLeft;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private el: ElementRef
  ) {
    this.userContactSub = this.userService.userContact$.subscribe(
      (doc: DefaultContact) => {
        this.user = doc;
      }
    );

    this.userService.user$.subscribe(
      (doc: User) => {
        this.idUser = doc.id;
      },
      (error) => console.log(error)
    );

    this.roomService.view$.subscribe((data: string) => {
      this.view = data;
    });
  }

  ngDoCheck(): void {
    if (window.innerWidth < 950) {
      if (this.view === 'profile') {
        this.el.nativeElement.style.display = 'block';
      } else {
        this.el.nativeElement.style.display = 'none';
      }
    }
  }

  openDialog(): void {
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

  cleanChat(): void {
    try {
      const res = this.roomService.cleanChat();

      setTimeout(() => {
        res.unsubscribe();
      }, 200);
    } catch (error) {
      this.openSnackBar('error cleaning chat', 'dismiss');
    }
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

  ngOnDestroy() {
    this.user = {};
    this.userService.clean();
    this.userContactSub.unsubscribe();
  }
}
