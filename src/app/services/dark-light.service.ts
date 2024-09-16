import { Injectable } from '@angular/core';




@Injectable({
  providedIn: 'root'
})
export class DarkLightService {
  private theme:string = "light_mode";
  
  Set_theme() {
    if (this.theme === "dark_mode"){
      document.body.classList.remove("darkMode");
      this.theme = "light_mode";
    }else{
      this.theme = "dark_mode";
      document.body.classList.add("darkMode");
    }
  }
  Get_theme(){
    return this.theme;
  }
  constructor() { 
    const is_dark_mode = window.matchMedia('(prefers-color-scheme:dark)').matches;
    if (is_dark_mode){
      document.body.classList.add("darkMode");
      this.theme = "dark_mode";
    }
    console.log(this.theme);
  }
  
}
