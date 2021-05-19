import { Component } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogContactComponent } from './../dialog-contact/dialog-contact.component';

@Component({
  selector: 'app-contact-user-view',
  templateUrl: './contact-user-view.component.html',
  styleUrls: ['./contact-user-view.component.scss'],
})
export class ContactUserViewComponent {
  user: any = undefined;

  constructor(private userService: UserService, public dialog: MatDialog) {
    this.userService.userContact$.subscribe((doc) => {
      this.user = doc;
    });
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogContactComponent);

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }
}
