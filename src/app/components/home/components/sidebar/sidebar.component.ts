import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  DoCheck,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { Subject } from 'rxjs';

import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';
import { AuthService } from '@services/auth/auth.service';
import { User, Contact } from '@models/user.model';

import { DialogSettingsComponent } from './components/dialog-settings/dialog-settings.component';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('avatar', { static: true }) avatar: ElementRef;
  @ViewChild('menuTrigger') menuTrigger: MatMenuTrigger;

  private unsubscribe$ = new Subject<void>();

  listUserItem: Contact[];
  user: User;
  activeChat = false;
  activeContact = false;
  view: string;
  getRoomSub: any;
  getUserContactSub: any;
  getMessageSub: any;

  // icon
  faEllipsisV = faEllipsisV;

  constructor(
    private userService: UserService,
    private roomService: RoomService,
    private authService: AuthService,
    private router: Router,
    private el: ElementRef,
    public dialog: MatDialog
  ) {
    this.userService.user$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((user) => {
        this.user = user;
        this.getContacts();
      });

    this.roomService.view$
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.view = data;
      });
  }

  ngOnInit(): void {}

  ngDoCheck(): void {
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

  getContacts(): void {
    this.userService
      .getContacts(this.user.id)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((contacts: any[]) => {
        this.listUserItem = [];

        if (this.activeContact) {
          this.getUserContactSub?.unsubscribe();
          this.getRoomSub?.unsubscribe();
        }

        if (contacts?.length !== undefined && contacts?.length >= 0) {
          this.activeContact = true;

          for (let index = 0; index < contacts.length; index++) {
            this.getUserContactSub = this.userService
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

            this.getRoomSub = this.roomService
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

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogSettingsComponent, {
      restoreFocus: false,
    });
    dialogRef.afterClosed().subscribe(() => this.menuTrigger.focus());
  }

  handleClick(
    id: string,
    userID: string,
    contactsID: string,
    idUser: string
  ): void {
    if (this.activeChat) {
      this.getMessageSub.unsubscribe();
    }
    this.activeChat = true;
    if (this.user.id !== idUser) {
      this.roomService.messageRead(id);
    }
    this.getMessageSub = this.roomService.getMessage(id);

    this.roomService.getLastMessage(id);
    this.userService.setUserContact(userID, contactsID);
  }

  exit(): void {
    try {
      this.authService
        .exit()
        .then(() => {
          this.router.navigate(['/sign-in']);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error('failed exit');
    }
  }

  ngOnDestroy(): void {
    this.activeContact = false;
    this.getRoomSub.unsubscribe();
    this.getUserContactSub.unsubscribe();
    if (this.activeChat) {
      this.getMessageSub.unsubscribe();
    }
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
