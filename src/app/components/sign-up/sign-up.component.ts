import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '@services/auth/auth.service';
import { UserService } from '@services/user/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  form!: FormGroup;
  hide = true;

  constructor(
    private snackBar: MatSnackBar,
    private router: Router,
    private authService: AuthService,
    private usersService: UserService,
    private formBuilder: FormBuilder
  ) {
    this.buildForm();
  }

  ngOnInit(): void {}

  private buildForm(): void {
    this.form = this.formBuilder.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8), Validators.required]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const { email, firstName, lastName, password } = this.form.value;
      this.authService
        .signUp(email, password)
        .then((credentials: any) => {
          const id = credentials.user.uid;
          this.usersService.createUser(firstName, lastName, email, id);
          this.router.navigate(['/sign-in']);
        })
        .catch((response: any) => {
          this.openSnackBar(response.message, 'dismiss');
        });
    }
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 5000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }
}
