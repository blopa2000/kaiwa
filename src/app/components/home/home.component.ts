import { Component, OnInit } from '@angular/core';
import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  user: any = {
    firstName: '',
    lastName: '',
    avatar: '',
  };

  constructor(
    private authService: AuthService,
    private usersService: UserService
  ) {
    this.getuser();
  }

  getuser(): void {
    this.authService.verifyUser().subscribe((data) => {
      this.usersService.getUser(data.uid).subscribe((doc: any) => {
        this.user = doc;
      });
    });
  }

  ngOnInit(): void {}
}
