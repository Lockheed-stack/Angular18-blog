import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';

export interface AI_TextOnly_Prompt {
  Msg: Msg;
  ModelKind: string;
  Temperature: number;
  TopK: number;
}
export interface Msg {
  content: string;
  role: string;
  [property: string]: any;
}

export interface AI_Text_to_Img_Prompt {
  Prompt: string;
  Height: number;
  Width: number;
  Guidance: number;
  ModelKind: string;
}

@Injectable({
  providedIn: 'root'
})


export class AiService {

  constructor(
    private domain: GlobalService,
    private http: HttpClient,
  ) { }

  StreamGetAIChatResponse(prompt: AI_TextOnly_Prompt) {
    const url = this.domain.domain + "ai/chat";
    return this.http.post(
      url,
      prompt,
      {
        observe: 'events',
        responseType: 'text',
        reportProgress: true,
      }
    )
  }

  AIPaintingResponse(prompt: AI_Text_to_Img_Prompt) {
    const url = this.domain.domain + "ai/text2img";
    return this.http.post(
      url,
      prompt,
      {
        responseType: "blob"
      }
    )
  }
}
