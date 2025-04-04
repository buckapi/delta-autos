import { Component } from '@angular/core';
import { ScriptLoaderService } from '../../services/loader.service';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../interfaces/vehicle.interface';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { WHATSAPP_NUMBER } from '../../constants/vehicle.constants';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-car-detail',
  imports: [CommonModule],
  templateUrl: './car-detail.component.html',
  styleUrl: './car-detail.component.css'
})
export class CarDetailComponent {
  vehicle: Vehicle | null = null;
  whatsappNumber = WHATSAPP_NUMBER;


  constructor(
    public globalService: GlobalService,
    public vehicleService: VehicleService,
    private sanitizer: DomSanitizer,
    public scriptLoader: ScriptLoaderService) {   
    this.loadScripts();
  }

  ngOnInit(): void {
    this.loadScripts();
  }
 

  loadScripts() {
    const scripts = [
      'app/js/jquery.min.js',
      'app/js/jquery.easing.js',
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
