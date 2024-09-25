import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DarkLightService {
  
  toggle_theme() {
    return document.body.classList.toggle("darkMode");
  }
  get_theme(){
    return document.body.classList.contains("darkMode");
  }
  constructor() { }
  
}
