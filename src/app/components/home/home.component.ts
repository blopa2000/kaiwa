import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  verifyUserSub: any;
  getuserSub: any;
  constructor(
    private authService: AuthService,
    private usersService: UserService
  ) {
    this.getuser();
  }

  ngOnInit(): void {}

  private getuser(): void {
    this.verifyUserSub = this.authService.verifyUser().subscribe((data) => {
      this.getuserSub = this.usersService.getUser(data?.uid);
    });
  }

  ngOnDestroy(): void {
    this.verifyUserSub.unsubscribe();
    this.getuserSub.unsubscribe();
  }
}
