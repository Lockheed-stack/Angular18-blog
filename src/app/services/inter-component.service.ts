import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterComponentService {

  constructor() { }
  void_subject = new Subject<void>();

  sendVoidMessage() {
    this.void_subject.next();
  }
  getVoidMessageObservable() {
    return this.void_subject.asObservable();
  }
}
