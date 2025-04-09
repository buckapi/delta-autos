import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-autoparts',
  imports: [],
  templateUrl: './autoparts.component.html',
  styleUrl: './autoparts.component.css'
})
export class AutopartsComponent {
constructor(
  public globalService: GlobalService) { }
}
