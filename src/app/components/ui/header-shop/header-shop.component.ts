import { Component } from '@angular/core';
import { GlobalService } from '../../../services/global.service';

@Component({
  selector: 'app-header-shop',
  imports: [],
  templateUrl: './header-shop.component.html',
  styleUrl: './header-shop.component.css'
})
export class HeaderShopComponent {
  constructor(
public globalService:GlobalService

  ) { }

}
