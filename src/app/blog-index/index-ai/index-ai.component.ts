import { AfterViewInit, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { GlobalService } from '../../services/global.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AiService, AI_TextOnly_Prompt, AI_Text_to_Img_Prompt } from '../../services/ai.service';
import { HttpDownloadProgressEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';
import { KatexOptions, MarkdownModule, } from 'ngx-markdown';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { NgStyle } from '@angular/common';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subject, takeUntil } from 'rxjs';


import hljs from 'highlight.js/lib/common';
import hljs_dockerfile from 'highlight.js/lib/languages/dockerfile'

hljs.registerLanguage('dockerfile', hljs_dockerfile);

enum AIorHuman {
  AI,
  Human,
}

interface ModelType {
  value: string;
  viewValue: string;
}
interface ModelGroup {
  name: string;
  models: ModelType[];
}
interface ModelTunningOptions {
  name: string;
  description?: string;
  icon?: string;
  step: number;
  default_value: number;
  min_value: number;
  max_value: number;
}
interface ModelParameterRange {
  min_val: number;
  max_val: number;
}

interface ChatingRecords {
  id: number,
  content: string,
  content_type: number,
  spokesman: AIorHuman,
  username?: string,
  avatar?: string,
  errorInfo?: string,
}

@Component({
  selector: 'app-index-ai',
  standalone: true,
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MarkdownModule,
    MatSelectModule,
    MatSidenavModule,
    MatListModule,
    MatDividerModule,
    MatSliderModule,
    MatTooltipModule,
    FormsModule,
    NgStyle
  ],
  templateUrl: './index-ai.component.html',
  styleUrl: './index-ai.component.scss'
})
export class IndexAiComponent implements OnInit, AfterViewInit,OnDestroy {

  // inject services
  globalservice = inject(GlobalService);
  aiService = inject(AiService);
  breakpointServer = inject(BreakpointObserver)

  // variables of conversation
  chatingRecordsArray: Array<ChatingRecords> = [];
  conversationID: number = 0;

  // model relate
  modelFormGroup: FormGroup;
  modelGroups: ModelGroup[] = [
    {
      name: "文本生成(text only)",
      models: [
        { value: "qwen1.5-7b-chat-awq", viewValue: "qwen1.5-7b-chat-awq" },
        { value: "qwen1.5-14b-chat-awq", viewValue: "qwen1.5-14b-chat-awq" },
        { value: "llama-3.1-70b-instruct", viewValue: "llama-3.1-70b-instruct" }
      ]
    },
    {
      name: "文本转图片(text-to-image)",
      models: [
        { value: "stable-diffusion-xl-base-1.0", viewValue: "stable-diffusion-xl-base-1.0" },
        { value: "stable-diffusion-xl-lightning", viewValue: "stable-diffusion-xl-lightning" },
      ]
    }
  ];
  modelBelongsTo: Map<string, number> = new Map<string, number>(
    [
      ["qwen1.5-7b-chat-awq", 0],
      ["qwen1.5-14b-chat-awq", 0],
      ["llama-3.1-70b-instruct", 0],
      ["stable-diffusion-xl-base-1.0", 1],
      ["stable-diffusion-xl-lightning", 1],
    ]
  );
  tunningOptions: ModelTunningOptions[] = [];
  textOnlyOptions: ModelTunningOptions[] = [
    {
      name: "temperature",
      description: "Controls the randomness of the output; higher values produce more random results.",
      default_value: 0.6,
      min_value: 0,
      max_value: 5,
      step: 0.1,
      icon: "thermostat"
    },
    {
      name: "top_k",
      description: "Limits the AI to choose from the top 'k' most probable words. Lower values make responses more focused; higher values introduce more variety and potential surprises.",
      default_value: 20,
      min_value: 1,
      max_value: 50,
      step: 1,
      icon: "sports_score"
    }
  ];
  textToImgOptions: ModelTunningOptions[] = [
    {
      name: "height",
      description: "The height of the generated image in pixels",
      default_value: 1024,
      min_value: 256,
      max_value: 2048,
      step: 1,
      icon: "height"
    },
    {
      name: "width",
      description: "The width of the generated image in pixels",
      default_value: 1024,
      min_value: 256,
      max_value: 2048,
      step: 1,
      icon: "settings_ethernet"
    },
    {
      name: "guidance",
      description: "Controls how closely the generated image should adhere to the prompt; higher values make the image more aligned with the prompt",
      default_value: 7.5,
      min_value: 1,
      max_value: 15,
      step: 0.1,
      icon: "emoji_objects"
    },
  ];
  validParameterRange: Map<string, ModelParameterRange> = new Map<string, ModelParameterRange>(
    [
      ["temperature", { min_val: 0, max_val: 5 }],
      ["top_k", { min_val: 1, max_val: 50 }],
      ["height", { min_val: 256, max_val: 1024 }],
      ["width", { min_val: 256, max_val: 1024 }],
      ["guidance", { min_val: 1, max_val: 15 }],
    ]
  )

  // interface and interactive logics setting
  chatFormGroup: FormGroup;
  disableSendBtn: boolean = false;
  inputElement: HTMLInputElement;
  katexOpt: KatexOptions = {
    throwOnError: false,
    output: "mathml",
    displayMode: true
  }
  destroyed = new Subject<void>();
  openModelSetting: boolean = true;
  sidenavMode:MatDrawerMode = "side";
  chatboxWidth:string = "70vw";

  scrollToLatestNews(timeout: number) {
    setTimeout(() => {
      const el = document.getElementById("msger-chat");
      if (el.scrollHeight > el.clientHeight) {
        el.scrollTo({
          top: el.scrollHeight,
          behavior: "smooth",
        })
      }
    }, timeout);
  }

  settingBtnClicked() {
    this.openModelSetting = !this.openModelSetting;
  }

  onImgLoadFail(item: ChatingRecords) {
    item.errorInfo = "图片生成失败，请调整参数或提示词后重试";
  }
  onParameterInputBlur(formControlName: string) {
    const tmp = this.validParameterRange.get(formControlName);
    if (tmp !== undefined) {
      const curVal = this.modelFormGroup.get(formControlName).value;
      if (curVal < tmp.min_val) {
        this.modelFormGroup.get(formControlName).setValue(tmp.min_val);
      } else if (curVal > tmp.max_val) {
        this.modelFormGroup.get(formControlName).setValue(tmp.max_val);
      }
    }
  }

  changeModel(event: MatSelectChange) {
    const tmp = event.value as string;
    if (this.modelBelongsTo.get(tmp) === 0) {
      this.tunningOptions = this.textOnlyOptions;
    } else {
      this.tunningOptions = this.textToImgOptions;
    }
  }

  submitPrompt() {
    if (this.chatFormGroup.valid) {
      // user questions
      this.disableSendBtn = true;
      const avatar = window.sessionStorage.getItem('avatar');
      const username = window.sessionStorage.getItem('username');
      const record: ChatingRecords = {
        id: this.conversationID,
        username: username === null ? "???" : username,
        spokesman: AIorHuman.Human,
        content_type: 0,
        content: this.chatFormGroup.value.prompt,
        avatar: avatar === null ? this.globalservice.avatarPlaceholder : avatar,
      }
      this.conversationID += 1;
      this.chatFormGroup.setValue({ prompt: "" });
      this.inputElement.value = "";
      this.chatFormGroup.get("prompt").setErrors({ required: false });
      this.chatingRecordsArray.push(record);
      this.scrollToLatestNews(10);

      // AI answers
      const tmp: ChatingRecords = {
        id: this.conversationID,
        username: this.modelFormGroup.get('ModelKind').value,
        content_type: this.modelBelongsTo.get(this.modelFormGroup.get('ModelKind').value),
        spokesman: AIorHuman.AI,
        content: "",
      }

      this.chatingRecordsArray.push(tmp);
      switch (tmp.content_type) {
        case 1: { // text-to-image
          const prompt: AI_Text_to_Img_Prompt = {
            Prompt: record.content,
            Height: this.modelFormGroup.get('height').value,
            Width: this.modelFormGroup.get('width').value,
            Guidance: this.modelFormGroup.get('guidance').value,
            ModelKind: this.modelFormGroup.get('ModelKind').value,
          }

          this.aiService.AIPaintingResponse(prompt).subscribe({
            next: (img) => {
              const reader = new FileReader();
              reader.readAsDataURL(img);
              reader.onload = () => {
                this.chatingRecordsArray[this.conversationID].content = reader.result.toString();
                this.conversationID += 1;
                this.scrollToLatestNews(10);
                this.disableSendBtn = false;
              }
            },
            error: (err) => {
              const e = err as HttpErrorResponse;
              this.chatingRecordsArray[this.conversationID].content = this.globalservice.FailedToLoadImgPlaceholder;

              if (e.status === 401) {
                this.chatingRecordsArray[this.conversationID].errorInfo = "登录后解锁无限制次数对话";
              } else {
                this.chatingRecordsArray[this.conversationID].errorInfo = e.message;
              }

              this.conversationID += 1;
              this.scrollToLatestNews(10);
              this.disableSendBtn = false;
            }
          })
          break;
        }
        default: { // text only
          const prompt: AI_TextOnly_Prompt = {
            Msg: {
              content: record.content,
              role: "assistant"
            },
            ModelKind: this.modelFormGroup.get('ModelKind').value,
            Temperature: this.modelFormGroup.get('temperature').value,
            TopK: this.modelFormGroup.get('top_k').value
          }

          this.aiService.StreamGetAIChatResponse(prompt).subscribe({
            next: (event) => {
              if (event.type === HttpEventType.DownloadProgress) {
                const partial = (event as HttpDownloadProgressEvent).partialText!;
                this.chatingRecordsArray[this.conversationID].content = partial;
                this.scrollToLatestNews(10);
              } else if (event.type === HttpEventType.Response) {
                // AI finished this answer.
                this.conversationID += 1;
                this.scrollToLatestNews(10);
                this.disableSendBtn = false;
                hljs.highlightAll();
              }
            },
            error: (err) => {
              const e = err as HttpErrorResponse;

              if (e.status === 401) {
                this.chatingRecordsArray[this.conversationID].content = "登录后解锁无限制次数对话";
              } else {
                this.chatingRecordsArray[this.conversationID].content = e.message;
              }

              this.conversationID += 1;
              this.scrollToLatestNews(10);
              this.disableSendBtn = false;
            }
          })
        }
      }
    } else {
      // modify input-form control-group status.
      this.chatFormGroup.get("prompt").setErrors({ required: true });
    }
  }

  ngOnInit(): void {

    // Form 
    this.chatFormGroup = new FormGroup({
      "prompt": new FormControl('', [Validators.required])
    })
    this.modelFormGroup = new FormGroup({
      "ModelKind": new FormControl(this.modelGroups[0].models[0].value),
      "temperature": new FormControl(this.textOnlyOptions[0].default_value),
      "top_k": new FormControl(this.textOnlyOptions[1].default_value),
      "height": new FormControl(this.textToImgOptions[0].default_value),
      "width": new FormControl(this.textToImgOptions[1].default_value),
      "guidance": new FormControl(this.textToImgOptions[2].default_value)
    });

    // model tunning options
    this.tunningOptions = this.textOnlyOptions;

    // UI control
    this.inputElement = (document.getElementById("ai-chat-input")) as HTMLInputElement;
    this.breakpointServer.observe([
      Breakpoints.XSmall,
      Breakpoints.Small,
    ]).pipe(takeUntil(this.destroyed)).subscribe(result => {
      if (result.matches) {
        this.openModelSetting = false;
        this.sidenavMode = "over";
        this.chatboxWidth = "95vw";
      } else {
        this.openModelSetting = true;
        this.sidenavMode = "push";
        this.chatboxWidth = "70vw";
      }
    });
  }
  ngAfterViewInit(): void {
    setTimeout(() => {
      if (document.documentElement.scrollHeight > document.documentElement.clientHeight) {
        document.documentElement.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        })
      }
    }, 500);
  }
  ngOnDestroy(): void {
    this.destroyed.next();
    this.destroyed.complete();
  }
}
