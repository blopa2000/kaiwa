import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private usersService: UserService
  ) {
    this.getuser();
  }

  getuser(): void {
    this.authService.verifyUser().subscribe((data) => {
      this.usersService.getUser(data.uid);
    });
  }

  ngOnInit(): void {}
}
