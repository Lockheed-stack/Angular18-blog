import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIconComponent } from '@ng-icons/core';
import { Subscription } from 'rxjs';

import { UploadImgComponent } from '../../../shared/uploads/upload-img/upload-img.component';
import { MatStepperModule } from '@angular/material/stepper';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { EditMarkdownComponent } from './edit-markdown/edit-markdown.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../../../shared/snack-bar/snack-bar.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ArticleInfo } from '../../../services/articles.service';
interface EditableFieldConfig {
  lines: number,
  icon: string,
  label: string,
  formControlName: string,
  originValue?: string
}
enum Add_or_Update {
  add,
  update,
  none
}

@Component({
  selector: 'app-article-edit',
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
    MatStepperModule,
    TextFieldModule,
    MatSelectModule,
    MatRadioModule,
    EditMarkdownComponent,
    MatTooltipModule
  ],
  templateUrl: './edit.component.html',
  styleUrl: './edit.component.scss'
})
export class EditComponent implements OnInit, OnDestroy {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) { }
  subscription: Subscription = new Subscription();
  // interactive relate various
  readonly dialog = inject(MatDialog);
  private dialogRef: MatDialogRef<ConfirmDialogComponent>;
  readonly snackbar = inject(MatSnackBar);
  tooltips:string = `
  功能有限，完善中。注意事项：

  1. 对于 inline 元素，如普通文本，换行需要 2 次回车。
  
  2.采用 KaTex 渲染公式，需要输入 2 个 \\\\ 进行换行，且只能在指定的环境中才能换行，如 aligned,matrix。
  `

  // info relate various
  @Input() schema: Add_or_Update = Add_or_Update.none;
  @Input() blogInfo: ArticleInfo = null;
  categoryName: string[] = [
    "Ne pro case",
    "possim dolorum.",
    "Ne consul ubique",
    "aperiri quo.",
    "Et eum commodo facilis.Rebum",
    "每次组件输入发生变化时运行。",
    "ei pro",
    "porro verear",
    "malorum qui cu",
    "eum ad purto",
    "possit aliquid."
  ];

  // input and form relate various
  EditableFields: Array<EditableFieldConfig> = [
    { lines: 4, icon: "title", label: "文章标题", formControlName: "title" },
    { lines: 4, icon: "category", label: "分类", formControlName: "category" },
    { lines: 6, icon: "star", label: "文章描述", formControlName: "desc" },
    { lines: 4, icon: "cloud_upload", label: "文章封面", formControlName: "cover" },
  ]
  EditMode: number = 1;
  BlogMarkdownData: string = "";
  updatingForm: FormGroup;
  markdownTextArea: HTMLTextAreaElement = null;
  // submit relate various
  disableSubmitBtn: boolean = false;

  // support tab indent
  insertTabCharacter(e: KeyboardEvent) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const { value, selectionStart, selectionEnd } = this.markdownTextArea;
      this.markdownTextArea.value = `${value.substring(0, selectionEnd)}\t${value.substring(selectionEnd)}`;
      // Move cursor to new position
      this.markdownTextArea.selectionStart = this.markdownTextArea.selectionEnd = selectionEnd + 1;
    }
  };

  // handle input event
  onInputChanged(field: string, event: Event | string | number | MatSelectChange | MatRadioChange) {
    var val = null;
    if (event instanceof Event) {
      val = (<HTMLInputElement>event.target).value;
    } else if (event instanceof MatSelectChange) {
      val = event.value;
    } else if (event instanceof MatRadioChange) {
      val = event.value;
    } else if (typeof event === "string") {
      val = event;
    } else if (typeof event === "number") {
      val = event;
    }
    switch (field) {
      case "title": {
        this.blogInfo.Title = val;
        break;
      }
      case "category": {
        // this.blogInfo.Title = val;
        break;
      }
      case "desc": {
        this.blogInfo.Desc = val;
        break;
      }
      case "cover": {
        this.blogInfo.Img = val;
        break;
      }
      case "url": {
        this.EditMode = 1;
        break;
      }
      case "origin": {
        this.EditMode = 2;
        break;
      }
      case "write": {
        this.BlogMarkdownData = val;
        break;
      }
      case "stepper": {
        if (val === 2 && this.EditMode === 2) {
          // support tab indent
          this.markdownTextArea = document.getElementById("writeMarkdown") as HTMLTextAreaElement;
          this.insertTabCharacter = this.insertTabCharacter.bind(this);
          this.markdownTextArea.addEventListener('keydown', this.insertTabCharacter, false);
        }
      }
    }
  }
  onInputInvalid(formControlName: string) {
    switch (formControlName) {
      case "title":
        return "标题长度不超过 20 个字符";
      case "desc":
        return "最大长度 150 个字符";
      default:
        return ""
    }
  }
  // the markdown component is ready
  onMarkdownLoaded(val: string) {
    this.BlogMarkdownData = val;
  }

  onSubmitBtnClick() {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "确定提交?",
        content: "是否提交更新信息?"
      }
    })
    this.subscription.add(
      this.dialogRef.afterClosed().subscribe(() => {
        if (this.dialogRef.componentInstance.is_yes) {
          // execute updating logic
          this.disableSubmitBtn = true;
          this.snackbar.openFromComponent(SnackBarComponent, {
            data: {
              content: "正在处理更新请求..."
            }
          })
          // async callback function of processing result
          setTimeout(() => {
            this.snackbar.openFromComponent(SnackBarComponent, {
              data: {
                content: "更新成功"
              }
            })
            this.disableSubmitBtn = false;
          }, 1500);
        }
      })
    )
  }

  ngOnInit(): void {

    this.updatingForm = new FormGroup({
      "title": new FormControl(null, [Validators.maxLength(20)]),
      "category": new FormControl(),
      "desc": new FormControl(null, [Validators.maxLength(100)]),
      "cover": new FormControl()
    })

    // the user wants to update a blog
    if (this.schema === Add_or_Update.update && this.blogInfo !== null) {
      // init the form's value
      let setDefaultValue = {
        title: "",
        category: "",
        desc: "",
        cover: ""
      };
      setDefaultValue.title = this.blogInfo.Title;
      this.subscription = this.route.queryParams.subscribe((val) => {
        setDefaultValue.category = val['category'];
      })
      setDefaultValue.desc = this.blogInfo.Desc;
      setDefaultValue.cover = this.blogInfo.Img === undefined ? "" : this.blogInfo.Img;
      this.updatingForm.setValue(setDefaultValue);
    }else if(this.schema === Add_or_Update.add){
      this.blogInfo = {
        Title:"",
        Desc:"",
        Content:"",
      }
    }else {// but user offer a blog info that we don't need
      this.router.navigate(['allArticle'], { relativeTo: this.route.parent });
    }


  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.markdownTextArea !== null) {
      this.markdownTextArea.removeEventListener('keydown', this.insertTabCharacter, false);
    }
  }
}
