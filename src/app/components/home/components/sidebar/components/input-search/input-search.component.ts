import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';

@Component({
  selector: 'app-input-search',
  templateUrl: './input-search.component.html',
  styleUrls: ['./input-search.component.scss'],
})
export class InputSearchComponent implements OnInit {
  search: FormControl;
  listUsers: any[];
  idUser: string;
  listContacts: any[];
  constructor(
    private userService: UserService,
    private roomService: RoomService
  ) {
    this.search = new FormControl();

    this.userService.user$.subscribe((doc) => {
      this.idUser = doc.id;
      this.userService.validateMyContacts(doc.id).subscribe((doc) => {
        this.listContacts = doc;
      });
    });
  }

  ngOnInit(): void {
    this.search.valueChanges.subscribe((doc) => {
      this.userService.searchUsers(doc).subscribe((doc) => {
        this.listUsers = [];
        for (const user of doc.docs) {
          this.listUsers.push({ doc: user.data(), id: user.id });
        }
      });
    });
  }

  addContacts(id) {
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
      console.log('no se puede establecer un conexion');
    }
  }
}
