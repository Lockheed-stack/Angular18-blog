import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { NgIconComponent, provideIcons } from "@ng-icons/core"
import { bootstrapGithub } from "@ng-icons/bootstrap-icons"
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarRef } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../shared/snack-bar/snack-bar.component';
import { UploadImgComponent } from '../../shared/uploads/upload-img/upload-img.component';
import { Subscription } from 'rxjs';
import {UserInfo} from '../../services/user.service'
import { GlobalService } from '../../services/global.service';

interface EditableFieldConfig {
  lines: number,
  icon: string,
  label: string,
  formControlName: string
}


@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    MatIconModule,
    NgIconComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    ReactiveFormsModule,
    UploadImgComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
  viewProviders: [provideIcons({ bootstrapGithub })]
})
export class UserComponent implements OnInit, OnDestroy {
  readonly dialog = inject(MatDialog);
  submitDialogRef: MatDialogRef<ConfirmDialogComponent>;
  subscription: Subscription = new Subscription();
  readonly snackbar = inject(MatSnackBar);
  snackbarRef: MatSnackBarRef<SnackBarComponent>;

  readonly globalService = inject(GlobalService);
  userInfo: UserInfo = {
    ID: -1,
    Avatar: this.globalService.avatarPlaceholder,
    Username: "未知",
    SelfDesc: `写点什么吧...`,
    Location: "未知",
    Email: "未知",
    Github: "未知"
  }
  userInfoBackup: UserInfo = null;
  editMode: boolean = false;
  EditableFields: Array<EditableFieldConfig> = [
    { lines: 2, icon: "badge", label: "新昵称", formControlName: "nickname" },
    { lines: 2, icon: "mail", label: "E-mail", formControlName: "email" },
    { lines: 2, icon: "bootstrapGithub", label: "Github 地址", formControlName: "github" },
    { lines: 2, icon: "location_on", label: "定位", formControlName: "location" },
    { lines: 6, icon: "star", label: "个人简介", formControlName: "desc" },
    { lines: 4, icon: "cloud_upload", label: "上传新头像", formControlName: "avatar" },
  ]

  updatingForm: FormGroup;
  submitBtnDisabled: boolean = false;


  onEditBtnClicked() {
    this.editMode = !this.editMode;
    this.userInfo = { ...this.userInfoBackup }
  }

  onInputChanged(field: string, event: Event | string) {
    if (event instanceof Event) {
      var val = (<HTMLInputElement>event.target).value;
    } else {
      val = event;
    }
    switch (field) {
      case "nickname": {
        this.userInfo.Username = val;
        break;
      }
      case "email": {
        this.userInfo.Email = val;
        break;
      }
      case "github": {
        this.userInfo.Github = val;
        break;
      }
      case "location": {
        this.userInfo.Location = val;
        break;
      }
      case "desc": {
        this.userInfo.SelfDesc = val;
        break;
      }
      case "avatar": {
        this.userInfo.Avatar = val;
      }
    }
  }

  onInputInvalid(formControlName: string) {
    switch (formControlName) {
      case "nickname":
        return "昵称长度不超过 20 个字符";
      case "desc":
        return "最大长度 150 个字符";
      case "email":
        return "邮箱格式错误";
      default:
          return ""
    }
  }

  submitUpdatedUserInfo() {
    this.submitDialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "更新信息?",
        content: "是否提交更新信息?"
      }
    })
    // User confirms submission of updates
    this.subscription.add(
      this.submitDialogRef.afterClosed().subscribe(() => {
        if (this.submitDialogRef.componentInstance.is_yes) {
          this.submitBtnDisabled = true;
          this.snackbar.openFromComponent(SnackBarComponent, {
            data: {
              content: "已提交, 正在处理..."
            },
            duration: 8000
          })
          // logic of successful login
          setTimeout(() => {
            this.snackbarRef = this.snackbar.openFromComponent(SnackBarComponent, {
              data: {
                content: "更新成功!"
              },
              duration: 8000
            })
            this.subscription.add(
              this.snackbarRef.afterDismissed().subscribe(() => {
                this.submitBtnDisabled = false;
              })
            )
          }, 2000);
        }
      })
    )
  }

  ngOnInit(): void {
    // get userinfo
    this.userInfo.Avatar = window.sessionStorage.getItem("avatar");
    this.userInfo.ID = Number(window.sessionStorage.getItem("UID"));
    this.userInfo.Username = window.sessionStorage.getItem("username");
    this.userInfoBackup = {...this.userInfo};
    // form control
    this.updatingForm = new FormGroup({
      "nickname": new FormControl(null,[Validators.maxLength(20)]),
      "desc": new FormControl(null,[Validators.maxLength(150)]),
      "location": new FormControl(),
      "email": new FormControl(null, [Validators.email]),
      "github": new FormControl(),
      "avatar": new FormControl()
    })
    const setDefaultValue={
      nickname: this.userInfo.Username,
      desc:this.userInfo.SelfDesc,
      location:this.userInfo.Location,
      email:this.userInfo.Email,
      github:this.userInfo.Github,
      avatar:this.userInfo.Avatar
    }
    this.updatingForm.setValue(setDefaultValue);
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
