import { Component, EventEmitter, inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../snack-bar/snack-bar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-upload-img',
  standalone: true,
  imports: [],
  templateUrl: './upload-img.component.html',
  styleUrl: './upload-img.component.scss'
})
export class UploadImgComponent implements OnInit,OnDestroy{
  @Input() label: string = "选择文件";
  @Input() maxImgSize: number = 0;
  @Output() imgReady: EventEmitter<string> = new EventEmitter<string>();
  readonly snackbar = inject(MatSnackBar);
  supportFormat:Map<string,boolean>;
  // subscription:Subscription = Subscription.EMPTY;

  onInputChanged(event: Event) {
    const reader = new FileReader();
    const img = (<HTMLInputElement>event.target).files[0];
    // check input file type
    if (!this.supportFormat.has(img.type)){
      this.snackbar.openFromComponent(SnackBarComponent, {
        data: {
          content: "不支持该类型文件!"
        },
        duration: 8000
      })
      return;
    }
    // check input file size
    const sizeLimit150kb = (img.size / 1024 < this.maxImgSize || this.maxImgSize===0) ? true : false;
    if (sizeLimit150kb) {
      reader.readAsDataURL(img);
      reader.onload = () => {
        this.imgReady.emit(reader.result as string);
      }
    } else {
      this.snackbar.openFromComponent(SnackBarComponent, {
        data: {
          content: "图片大小不超过 150KB !"
        },
        duration: 8000
      })
      return;
    }
  }
  ngOnInit(): void {
      this.supportFormat = new Map<string,boolean>([
        ["image/jpeg",true],
        ["image/png",true],
        ["image/jpg",true],
      ]);
  }
  ngOnDestroy(): void {
      // this.subscription.unsubscribe();
  }
}
