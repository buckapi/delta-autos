import { Component } from '@angular/core';
import { ScriptLoaderService } from '../../services/loader.service';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RealtimeVehiclesService } from '../../services/realtime-vehicles.service';
import { Vehicle } from '../../interfaces/vehicle.interface';
import { VEHICLE_TYPES } from '../../constants/vehicle.constants';
import { VehicleSliderComponent } from '../vehicle-slider/vehicle-slider.component';
@Component({
  selector: 'app-shop',
  imports: [CommonModule, FormsModule, ReactiveFormsModule,VehicleSliderComponent],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {
  vehicleTypes = Object.values(VEHICLE_TYPES);
  selectedType: string = VEHICLE_TYPES.ORIGINAL.id;
  constructor(public scriptLoader: ScriptLoaderService,
    public global:GlobalService,
    public realtimeVehiclesService: RealtimeVehiclesService
  ) { }
  vehicles: Vehicle[] = [];
  loading = true;
  ngOnInit(): void {

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
  selectVehicleType(typeId: string) {
    if(typeId === VEHICLE_TYPES.TODOS.id) {
      this.global.vehicleTypeSelected = false;
    } else {
      this.global.vehicleTypeSelected = true;
    }
    this.selectedType = typeId;
    this.global.typeIdSelected = typeId;
  }

  isSelected(typeId: string): boolean {
    return this.selectedType === typeId;
  }

  
}
