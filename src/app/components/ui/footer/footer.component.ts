import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-footer',
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent {
  
  constructor(public globalService: GlobalService) { }  
}
