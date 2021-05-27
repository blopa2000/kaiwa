import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  DoCheck,
} from '@angular/core';
import { Router } from '@angular/router';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';

import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';
import { AuthService } from '@services/auth/auth.service';

import { DialogSettingsComponent } from './components/dialog-settings/dialog-settings.component';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, DoCheck {
  @ViewChild('avatar', { static: true }) avatar: ElementRef;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  listUserItem: any[] = [];
  user: any = {};
  view: string;

  // icon
  faEllipsisV = faEllipsisV;

  constructor(
    private usersService: UserService,
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
    public dialog: MatDialog
  ) {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
      this.getContacts();
    });

    this.roomService.view$.subscribe((data) => {
      this.view = data;
    });
  }

  ngOnInit(): void {}

  ngDoCheck() {
    if (window.innerWidth < 950) {
      if (this.view === 'start') {
        this.el.nativeElement.style.display = 'block';
      } else {
        this.el.nativeElement.style.display = 'none';
      }
    }

    if (this.user.avatar !== undefined && this.user.avatar !== '') {
      this.avatar.nativeElement.style.backgroundImage = `url(${this.user.avatar})`;
    }
  }

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
  }

  openDialog() {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  async exit() {
    try {
      await this.authService.exit();
      this.router.navigate(['/sign-in']);
    } catch (error) {
      console.error('failed exit');
    }
  }
}
