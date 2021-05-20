import {
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  OnChanges,
} from '@angular/core';

import { RoomService } from '@services/room/room.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-user-list-item',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.scss'],
})
export class UserListItemComponent implements OnInit, OnChanges {
  @ViewChild('avatar', { static: true }) avatar: ElementRef;
  @Input() user: any;

  myUser: any = {};

  constructor(
    private roomService: RoomService,
    private userService: UserService
  ) {
    this.userService.user$.subscribe((doc) => {
      this.myUser = doc;
    });
  }

  ngOnChanges() {
    if (this.user.avatar !== undefined && this.user.avatar !== '') {
      this.avatar.nativeElement.style.backgroundImage = `url(${this.user.avatar})`;
    }
  }

  ngOnInit(): void {}

  handleClick(id: string, userID: string, contactsID: string): void {
    if (this.myUser.id !== this.user.room.idUser) {
      this.roomService.messageRead(id);
    }
    this.roomService.getMessage(id);
    this.userService.setUserContact(userID, contactsID);
  }
}
