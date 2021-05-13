import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { RoomService } from '@services/room/room.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [AuthService, UserService, RoomService],
})
export class CoreModule {}
