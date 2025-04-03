import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalService } from '../../services/global.service';
import { RealtimeVehiclesService } from '../../services/realtime-vehicles.service';
import { Vehicle } from '../../interfaces/vehicle.interface';
import Swiper from 'swiper';

@Component({
  selector: 'app-by-budget',
  imports: [CommonModule],
  templateUrl: './by-budget.component.html',
  styleUrl: './by-budget.component.css'
})
export class ByBudgetComponent implements OnInit, OnDestroy, AfterViewInit {
  vehicles: Vehicle[] = [];
  loading = true;

  @ViewChild('swiperContainer') swiperContainer!: ElementRef;

  constructor(
    public globalService: GlobalService,
    private realtimeVehiclesService: RealtimeVehiclesService
  ) { }

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
    // Esperar un poco para asegurar que el DOM esté listo
    setTimeout(() => {
      const vehicleContainers = document.querySelectorAll('.swiper-container');
      vehicleContainers.forEach(container => {
        const swiper = new Swiper(container as any, {
          slidesPerView: 1,
          spaceBetween: 0,
          navigation: {
            nextEl: container.querySelector('.swiper-button-next') as HTMLElement,
            prevEl: container.querySelector('.swiper-button-prev') as HTMLElement,
          },
          loop: true,
          autoplay: {
            delay: 3000,
            disableOnInteraction: false,
          }
        });
        console.log('Swiper inicializado:', swiper);
      });
    }, 500);
  }

  ngOnDestroy() {
  }
}