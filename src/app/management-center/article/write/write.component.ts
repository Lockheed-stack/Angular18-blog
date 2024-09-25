import { Component } from '@angular/core';
import { EditComponent } from '../edit-logic/edit.component';

@Component({
  selector: 'app-write',
  standalone: true,
  imports: [
    EditComponent
  ],
  templateUrl: './write.component.html',
  styleUrl: './write.component.scss'
})
export class WriteComponent {

}
