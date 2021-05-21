import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';

import { DialogSettingsComponent } from './components/dialog-settings/dialog-settings.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('avatar', { static: true }) avatar: ElementRef;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  listUserItem: any[] = [];
  user: any = {};

  // icon
  faEllipsisV = faEllipsisV;

  constructor(
    private usersService: UserService,
    private roomService: RoomService,
    public dialog: MatDialog
  ) {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
      this.getContacts();
    });
  }

  ngOnInit(): void {}

  getContacts() {
    this.usersService.getContacts(this.user.id).subscribe((contacts: any) => {
      this.listUserItem = [];
      if (contacts !== null) {
        for (let index = 0; index < contacts.length; index++) {
          this.usersService
            .getUserContact(contacts[index].payload.doc.data().user)
            .subscribe((user: any) => {
              if (user !== undefined) {
                this.listUserItem[index] = {
                  ...this.listUserItem[index],
                  ...user,
                  id: contacts[index].payload.doc.data().user,
                  contactsID: contacts[index].payload.doc.id,
                };
              }
            });

          this.roomService
            .getRoom(contacts[index].payload.doc.data().room)
            .subscribe((room: any) => {
              if (room !== undefined) {
                this.listUserItem[index] = {
                  ...this.listUserItem[index],
                  room,
                  roomID: contacts[index].payload.doc.data().room,
                };
              }
              // this.listUserItem.sort(
              //   (a, b) => b?.room?.timeStamp - a?.room?.timeStamp
              // );
            });
        }
      }
    });

    if (this.user.avatar !== undefined && this.user.avatar !== '') {
      this.avatar.nativeElement.style.backgroundImage = `url(${this.user.avatar})`;
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  exit() {
    console.log('sign off');
  }
}
