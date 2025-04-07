import { Component, OnInit } from '@angular/core';
import { ScriptLoaderService } from '../../services/loader.service';
import { VEHICLE_TYPES } from '../../constants/vehicle.constants';
import { CommonModule } from '@angular/common';
import { KeyValue } from '@angular/common';
import { VehicleService } from '../../services/vehicle.service';
import { VehicleType } from '../../types/vehicle-types.interface';
import { GlobalService } from '../../services/global.service';

@Component({
  selector: 'app-filter',
  imports: [CommonModule],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})

export class FilterComponent implements OnInit {
  vehicleTypes = Object.values(VEHICLE_TYPES);
  selectedType: string = VEHICLE_TYPES.ORIGINAL.id;

  constructor(
    public vehicleService: VehicleService,
    public scriptLoader: ScriptLoaderService,
    private globalService: GlobalService
  ) { 
    this.loadScripts();
  }

  ngOnInit() {
    this.loadScripts();
    this.selectedType = this.globalService.typeIdSelected;
  }

  selectVehicleType(typeId: string) {
    if(typeId === VEHICLE_TYPES.TODOS.id) {
      this.globalService.vehicleTypeSelected = false;
    } else {
      this.globalService.vehicleTypeSelected = true;
    }
    this.selectedType = typeId;
    this.globalService.typeIdSelected = typeId;
  }

  isSelected(typeId: string): boolean {
    return this.selectedType === typeId;
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
  getVehicleTypes(): VehicleType[] {
    return Object.values(VEHICLE_TYPES); // Return the values from VEHICLE_TYPES
  }

}
