import { Component, inject, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    NgIf,
    RouterLink,
    LoginComponent
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss',
})
export class NavBarComponent implements OnInit {

  readonly dialog = inject(MatDialog);
  dialogCfg: MatDialogConfig = new MatDialogConfig();
  dialogRef: MatDialogRef<LoginComponent>;
  theme = "light_mode";
  avatarURL: string = "";


  toggleTheme() {
    if (this.theme === "dark_mode") {
      document.body.classList.remove("darkMode");
      this.theme = "light_mode";
    } else {
      this.theme = "dark_mode";
      document.body.classList.add("darkMode");
    }
  }
  openLoginDialog() {
    this.dialogRef = this.dialog.open(LoginComponent, this.dialogCfg);
    this.dialogRef.afterClosed().subscribe(() => {
      if (this.dialogRef.componentInstance.authUserResult === 0) {
        this.avatarURL = "https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png";
      }
    })
  }
  ngOnInit(): void {
    this.dialogCfg = {
      disableClose: true,
      height: "540px",
      maxHeight: "780px",
      width: "980px",
      maxWidth: "980px",
    }
  }
}
