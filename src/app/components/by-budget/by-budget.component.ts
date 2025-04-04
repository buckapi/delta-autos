import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { RealtimeVehiclesService } from '../../services/realtime-vehicles.service';
import { Vehicle } from '../../interfaces/vehicle.interface';
import { ScriptLoaderService } from '../../services/loader.service';
import { Swiper } from 'swiper';
import { VehicleSliderComponent } from '../vehicle-slider/vehicle-slider.component';

@Component({
  selector: 'app-by-budget',
  imports: [CommonModule, VehicleSliderComponent],
  templateUrl: './by-budget.component.html',
  styleUrl: './by-budget.component.css'
})
export class ByBudgetComponent implements OnInit, OnDestroy, AfterViewInit {
  vehicles: Vehicle[] = [];
  loading = true;
  @ViewChild('swiperContainer', { static: false, read: ElementRef }) swiperContainer!: ElementRef;
  swiper: Swiper | null = null;
  constructor(
    public scriptLoader: ScriptLoaderService,
    public globalService: GlobalService,
    private realtimeVehiclesService: RealtimeVehiclesService
  ) {
    this.loadScripts();
   }
   initializeSwiper() {
    if (!this.swiperContainer || !this.swiperContainer.nativeElement) {
      console.warn('Swiper container not found');
      return;
    }
  
    const container = this.swiperContainer.nativeElement;
    if (!container.querySelector('.swiper-wrapper') || !container.querySelector('.swiper-slide')) {
      console.warn('Swiper elements not found');
      return;
    }
  
  
  
    console.log('Swiper initialized successfully');
  }
  
  ngOnInit() {
    this.realtimeVehiclesService.Vehicles$.subscribe({
      next: (vehicles) => {
        this.vehicles = vehicles;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar vehículos:', error);
        this.loading = false;
      }
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      // Intentar inicializar usando ViewChild
      this.initializeSwiper();
    
      // Si no se inicializó con ViewChild, intentar con querySelector
      if (!this.swiper) {
        const vehicleContainers = document.querySelectorAll('.swiper-container');
        vehicleContainers.forEach(container => {
          const swiper = new Swiper(container as any, {
            slidesPerView: 1,
            spaceBetween: 0,
   
            loop: true,
            autoplay: {
              delay: 0,
              disableOnInteraction: false,
            },
            pagination: {
              el: container.querySelector('.swiper-pagination') as HTMLElement,
              clickable: true,
            }
          });
          console.log('Swiper inicializado:', swiper);
        });
      }
    }, 1000); // Aumentado a 1000ms para dar más tiempo al DOM
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
      // 'app/js/swiper-bundle.min.js',
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
  ngOnDestroy() {
  }
}