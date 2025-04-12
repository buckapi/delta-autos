import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
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
import { RepairComponent } from './components/repair/repair.component';
import { AutopartsComponent } from './components/autoparts/autoparts.component';
import { RealtimeVehiclesService } from './services/realtime-vehicles.service';
import { map } from 'rxjs';
import { Vehicle } from './interfaces/vehicle.interface';
declare var $: any; // Declaración para jQuery
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
    BlogComponent,
    RepairComponent,
    AutopartsComponent
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
    public realtimeVehiclesService: RealtimeVehiclesService,
    public globalService: GlobalService) {}
  ngOnInit() {
    this.loadScripts();
    this.checkVehicleId();
  }

  closeModal() {
    const modal = document.getElementById('popup_bid');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
      document.body.style.overflow = 'auto';
      document.body.style.paddingRight = '0';
      // Eliminar el backdrop de Bootstrap si existe
      this.cleanupBackdrops();
    }
  }
  private checkVehicleId() {
    // Verificar si hay un parámetro vehicleId en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('vehicleId');

    if (vehicleId) {
      // Buscar el vehículo correspondiente
      this.realtimeVehiclesService.vehicles$.pipe(
        map((vehicles: Vehicle[]) => vehicles.find(v => v.id === vehicleId))
      ).subscribe(v => {
        if (v) {
          this.globalService.vehicle = v;
          this.globalService.setRoute('car-detail', { id: vehicleId });
        }
      });
    }
  }
  private cleanupBackdrops() {
    const backdrops = document.getElementsByClassName('modal-backdrop');
    while (backdrops.length > 0) {
      backdrops[0].remove();
    }
    document.body.classList.remove('modal-open');
  }
 
  async login(event: Event) {
    event.preventDefault();
    this.errorMessage = null;
  
    if (!this.username || !this.password) {
      this.errorMessage = 'Por favor, complete todos los campos';
      return;
    }
  
    this.loading = true;
    try {
      await this.authService.login(this.username, this.password);
      // this.closeLoginModal();
      this.globalService.isModalOpen = false;
      this.closeModal();
      this.globalService.setRoute('dashboard');
      this.globalService.setDashboardOption('by-budget');
    } catch (error: any) {
      this.errorMessage = error.message || 'Error al iniciar sesión';
      console.error('Error en login:', error);
    } finally {
      this.loading = false;
    }
  }


  logout() {
    this.authService.logout();
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
  
  mostrarMensaje() {
    alert("¡Bienvenido a Delta Autos Invermax! Ofrecemos venta de vehículos de salvamento, tanto reparados como sin reparar. También brindamos servicios de latonería y pintura, así como asesoramiento legal. ¡Estamos aquí para ayudarte!");
  }
}
