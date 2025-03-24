import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
@Component({
  selector: 'app-blog',
  imports: [],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  constructor(
    public globalService: GlobalService
  ) { }
  ngOnInit() {
  }
}
