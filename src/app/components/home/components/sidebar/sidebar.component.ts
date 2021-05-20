import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  @ViewChild('avatar', { static: true }) avatar: ElementRef;

  listUserItem: any[] = [];
  user: any = {};

  // icon
  faEllipsisV = faEllipsisV;

  constructor(
    private usersService: UserService,
    private roomService: RoomService
  ) {
    this.usersService.user$.subscribe((user) => {
      this.user = user;
      this.getContacts();
    });
  }

  ngOnInit(): void {}

  getContacts() {
    this.listUserItem = [];
    this.usersService.getContacts(this.user.id).subscribe((contacts: any) => {
      if (contacts !== null) {
        for (let index = 0; index < contacts.length; index++) {
          this.usersService
            .getUserContact(contacts[index].payload.doc.data().user)
            .subscribe((user: any) => {
              this.listUserItem[index] = {
                ...this.listUserItem[index],
                ...user,
                id: contacts[index].payload.doc.data().user,
                contactsID: contacts[index].payload.doc.id,
              };
            });

          this.roomService
            .getRoom(contacts[index].payload.doc.data().room)
            .subscribe((room: any) => {
              this.listUserItem[index] = {
                ...this.listUserItem[index],
                room,
                roomID: contacts[index].payload.doc.data().room,
              };
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
}
