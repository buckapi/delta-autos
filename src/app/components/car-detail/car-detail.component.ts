import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ScriptLoaderService } from '../../services/loader.service';
import { VehicleService } from '../../services/vehicle.service';
import { Vehicle } from '../../interfaces/vehicle.interface';
import { GlobalService } from '../../services/global.service';
import { CommonModule } from '@angular/common';
import { WHATSAPP_NUMBER } from '../../constants/vehicle.constants';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
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
    this.vehicleService.getVehicleById(this.globalService.params.id).then(vehicle => {
      this.vehicle = vehicle; 
    });
  }

  // ngOnInit(): void {
  //   this.loadScripts();
  // }
  ngOnInit(): void {
    this.vehicleService.getVehicleById(this.globalService.params.id).then(vehicle => {
      this.vehicle = vehicle;
      // Esperamos 1 segundo después de obtener los datos
      setTimeout(() => {
        // Aquí puedes inicializar el carrusel si lo necesitas
        // Por ejemplo:
        // const swiper = new Swiper('.swiper', {
        //   // Configuración del carrusel
        // });
        this.loadScripts();
      }, 1000);
    });
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
  async generatePDF() {
    const element = document.getElementById('pdf-content');
    
    if (!element) {
      console.error('No se encontró el elemento con id "pdf-content"');
      return;
    }
  
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
  
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
  
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
  
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
  
      // Línea corregida:
      pdf.save(`Detalle_${this.globalService.vehicle?.name?.replace(/\s+/g, '_') ?? 'vehiculo'}.pdf`);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  }
}
