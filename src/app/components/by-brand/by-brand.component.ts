import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-by-brand',
  imports: [],
  templateUrl: './by-brand.component.html',
  styleUrl: './by-brand.component.css'
})
export class ByBrandComponent implements OnInit {
  constructor(
    public global: GlobalService
  ) { }

  ngOnInit(): void {
  }
}
