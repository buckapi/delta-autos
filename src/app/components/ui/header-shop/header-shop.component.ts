import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../services/global.service';
import { ScriptLoaderService } from '../../../services/loader.service';
import { AuthService } from '../../../services/auth.service';
@Component({
  selector: 'app-header-shop',
  imports: [],
  templateUrl: './header-shop.component.html',
  styleUrl: './header-shop.component.css'
})
export class HeaderShopComponent implements OnInit {
  constructor(
public globalService:GlobalService,
public authService: AuthService,public scriptLoader: ScriptLoaderService

  ) { }
  ngOnInit() {
    this.loadScripts();
  }
  loadScripts() {
    const scripts = [
      'app/js/jquery.min.js',
      // 'app/js/jquery.easing.js',
      'app/js/jquery.nice-select.min.js',
      'app/js/bootstrap.min.js',
      'app/js/plugin.js',
      // 'app/js/shortcodes.js',
      // 'app/js/main.js',
      'app/js/swiper-bundle.min.js',
      'app/js/swiper.js',
      'app/js/jquery-validate.js',
      // 'app/js/price-ranger.js' // Descomentar si se necesita
    ];

    const scriptPromises = scripts.map(script => this.scriptLoader.loadScript(script));
    
    Promise.all(scriptPromises)
      .then(() => {
        console.log('All scripts loaded successfully');
      })
      .catch(error => {
        console.error(error);
      });
  }
}
