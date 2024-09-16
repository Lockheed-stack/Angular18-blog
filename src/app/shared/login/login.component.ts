import { Component,  OnInit } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

enum Result{
    success,
    fail,
    none,
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    MatLabel,
    MatCheckboxModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit{
  constructor(private dialogRef:MatDialogRef<LoginComponent>){}
  signinForm: FormGroup;
  hidePassword: boolean = true;
  loginBtnDisable: boolean = false;
  authUserResult: Result = Result.none;
  
  onSubmit(){
    this.loginBtnDisable = true;
    this.authUserResult = Result.none;
    setTimeout(() => {
      this.authUserResult = Math.random()>0.7?Result.success:Result.fail;
      if (this.authUserResult === 0){
        setTimeout(() => {
          this.dialogRef.close();
        }, 2000);
      }else{
        this.loginBtnDisable = false;
      }
    }, 2000);
    
  }

  ngOnInit(): void {
    this.signinForm = new FormGroup({
      'username': new FormControl(null, [Validators.required]),
      'password': new FormControl(null, Validators.required),
    });
  }
}
