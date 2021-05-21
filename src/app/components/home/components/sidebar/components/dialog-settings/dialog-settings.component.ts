import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UserService } from '@services/user/user.service';
import { AngularFireStorage } from '@angular/fire/storage';

import { faCameraRetro } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dialog-settings',
  templateUrl: './dialog-settings.component.html',
  styleUrls: ['./dialog-settings.component.scss'],
})
export class DialogSettingsComponent implements OnInit {
  user: any;
  file: object;
  filePre: any;
  urlImage: string;
  form: FormGroup;
  faCameraRetro = faCameraRetro;
  spinner: boolean = false;

  constructor(
    private userService: UserService,
    private angularFireStorage: AngularFireStorage,
    private formBuilder: FormBuilder
  ) {
    this.userService.user$.subscribe((doc) => {
      this.user = doc;
    });
    this.buildForm();
  }

  ngOnInit(): void {}

  async update(e: Event) {
    e.preventDefault();

    if (this.form.valid) {
      this.spinner = true;
      const { firstName, lastName, description } = this.form.value;

      const filePath = `avatars/${this.user.id}`;
      const ref = this.angularFireStorage.ref(filePath);

      if (this.file) {
        await this.angularFireStorage.upload(filePath, this.file);
      }

      ref.getDownloadURL().subscribe((url) => {
        const user = {
          avatar: this.file === undefined ? this.user.avatar : url,
          firstName,
          lastName,
          description,
        };

        this.userService.updateUser(user, this.user.id);
        this.spinner = false;
      });
    }
  }

  onUploadImg(e: any) {
    this.file = e.target.files[0];

    let reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      this.filePre = reader.result;
    };
  }

  private buildForm() {
    this.form = this.formBuilder.group({
      firstName: [
        this.user.firstName,
        [Validators.required, Validators.maxLength(30)],
      ],
      lastName: [
        this.user.lastName,
        [Validators.required, Validators.maxLength(30)],
      ],
      description: [this.user.description, [Validators.maxLength(50)]],
    });
  }
}
