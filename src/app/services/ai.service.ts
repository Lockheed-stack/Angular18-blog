import { Injectable } from '@angular/core';
import { GlobalService } from './global.service';
import { HttpClient } from '@angular/common/http';

export interface AI_TextOnly_Prompt {
  Msg: Array<Msg>;
  ModelKind: string;
  Temperature: number;
  TopK: number;
}
export interface Msg {
  content: string;
  role: string;
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
    const url = this.domain.domain + "ai/auth/chat";
    // const url = "http://localhost:8000/" + "ai/auth/chat";
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
    const url = this.domain.domain + "ai/auth/text2img";
    // const url = "http://localhost:8000/" + "ai/auth/text2img";
    return this.http.post(
      url,
      prompt,
      {
        responseType: "blob"
      }
    )
  }

  StreamGetAISummarizationResponse(rawMarkdon: string, blogID: number) {
    // const url = "http://localhost:8000/" + "ai/summarization";
    const url = this.domain.domain + "ai/summarization";
    const blob = new Blob([rawMarkdon], { type: "text/plain" })
    return this.http.post(
      url,
      blob,
      {
        params: {
          blogID: blogID
        },
        observe: "events",
        responseType: "text",
        reportProgress: true,
      }
    )
  }
}
