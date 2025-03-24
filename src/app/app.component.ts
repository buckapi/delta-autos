import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScriptLoaderService } from './services/loader.service'; // Asegúrate de que la ruta sea correcta
import { SliderComponent } from './components/slider/slider.component';
import { FilterComponent } from './components/filter/filter.component';
import { HeaderComponent } from './components/ui/header/header.component';
import { FooterComponent } from './components/ui/footer/footer.component';
import { ByBudgetComponent } from './components/by-budget/by-budget.component';
import { OthersComponent } from './components/others/others.component';
import { UsedComponent } from './components/used/used.component';
import { ByBrandComponent } from './components/by-brand/by-brand.component';
import { ShopComponent } from './components/shop/shop.component';
import { CommonModule } from '@angular/common';
import { GlobalService } from './services/global.service';
import { HeaderShopComponent } from './components/ui/header-shop/header-shop.component';
import { CarDetailComponent } from './components/car-detail/car-detail.component';
import { BlogComponent } from './components/blog/blog.component';
import { BlogGridComponent } from './components/blog-grid/blog-grid.component';
import { ContactComponent } from './components/contact/contact.component';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    CarDetailComponent,
    ContactComponent,
    // HeaderComponent,
    HeaderShopComponent,
    SliderComponent,
    FilterComponent,
    ByBudgetComponent,
    OthersComponent,
    BlogGridComponent,
    // UsedComponent,
    ByBrandComponent,
    ShopComponent,
    FooterComponent,
    BlogComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'delta-autos';
  constructor(private scriptLoader: ScriptLoaderService, public globalService: GlobalService) {}
  ngOnInit() {
    this.loadScripts();
  }

  loadScripts() {
    const scripts = [
      'app/js/jquery.min.js',
      'app/js/jquery.easing.js',
      'app/js/jquery.nice-select.min.js',
      'app/js/bootstrap.min.js',
      'app/js/plugin.js',
      'app/js/shortcodes.js',
      'app/js/main.js',
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
