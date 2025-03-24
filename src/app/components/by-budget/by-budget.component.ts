import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-by-budget',
  imports: [CommonModule],
  templateUrl: './by-budget.component.html',
  styleUrl: './by-budget.component.css'
})
export class ByBudgetComponent {
  constructor(public globalService: GlobalService) { }
}
