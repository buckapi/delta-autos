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
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthService } from './services/auth.service';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule, 
    CarDetailComponent,
    ContactComponent,
    DashboardComponent,
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
  username: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string | null = null;
  constructor(
    private scriptLoader: ScriptLoaderService,
    public authService: AuthService,

     public globalService: GlobalService) {}
  ngOnInit() {
    this.loadScripts();
  }
  async login(event: Event) {
    event.preventDefault();
    this.errorMessage = null;

    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, completa todos los campos';
      return;
    }

    this.loading = true;

    try {
      const result = await this.authService.login(this.username, this.password);
      
      if (result.success) {
        this.globalService.setRoute('dashboard');
        this.globalService.setDashboardOption('by-budget');
      } else {
        this.errorMessage = result.error || 'Error al iniciar sesión';
      }
    } catch (error) {
      this.errorMessage = 'Error en la conexión con el servidor';
      console.error('Error en login:', error);
    } finally {
      this.loading = false;
    }
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
  logout() {
    this.authService.logout();
  }
}
