import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-repair',
  imports: [],
  templateUrl: './repair.component.html',
  styleUrl: './repair.component.css'
})
export class RepairComponent {
  constructor(
    public globalService: GlobalService) { }
}
