import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  declarations: [],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatBadgeModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
  ],
})
export class MaterialModule {}
