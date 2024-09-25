import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {MAT_SNACK_BAR_DATA, MatSnackBarModule, MatSnackBarRef} from '@angular/material/snack-bar';
@Component({
  selector: 'app-snack-bar',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatButtonModule
  ],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {
  data = inject(MAT_SNACK_BAR_DATA);
  snackBarRef = inject(MatSnackBarRef);
}
