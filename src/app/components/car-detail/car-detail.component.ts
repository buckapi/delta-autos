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
  import { FormsModule } from '@angular/forms'; 
  import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';

  @Component({
    selector: 'app-car-detail',
    imports: [CommonModule, FormsModule],
    templateUrl: './car-detail.component.html',
    styleUrl: './car-detail.component.css'
  })
  export class CarDetailComponent {
    
    vehicle: Vehicle | null = null;
    whatsappNumber = WHATSAPP_NUMBER;
    editingField: string | null = null;
    tempValue: string = '';

    constructor(
      public authService: AuthService,
      public globalService: GlobalService,
      public vehicleService: VehicleService,
      private sanitizer: DomSanitizer,
      public scriptLoader: ScriptLoaderService) {   
      this.loadScripts();
      this.vehicleService.getVehicleById(this.globalService.params.id).then(vehicle => {
        this.vehicle = vehicle; 
      });
    }
    startEditing(field: keyof Vehicle, value: string | number | undefined | null): void {
      this.editingField = field;
      this.tempValue = value?.toString() || '';
  }
  
  saveEdit(field: keyof Vehicle): void {
    if (!this.vehicle || !this.editingField || !this.vehicle.id) return;
    
    let value: any = this.tempValue;
    
    // Conversión especial para campos numéricos
    if (field === 'price') {
        value = Number(this.tempValue);
    }
    
    const updateData: Partial<Vehicle> = { 
        [field]: value 
    };
    
    this.vehicleService.updateVehicle(this.vehicle.id, updateData)
        .then(updatedVehicle => {
            this.vehicle = { ...this.vehicle, ...updatedVehicle };
            this.editingField = null;
            this.tempValue = '';
        })
        .catch(error => {
            console.error('Error updating vehicle:', error);
        });
}
    // ngOnInit(): void {
    //   this.loadScripts();
    // }
    ngOnInit(): void {
      this.vehicleService.getVehicleById(this.globalService.params.id).then(vehicle => {
        this.vehicle = vehicle;
        setTimeout(() => {
          this.loadScripts();
        }, 1000);
      });
    }
  

  cancelEdit(): void {
    this.editingField = null;
    this.tempValue = '';
  }
 
  async deleteVehicle(): Promise<void> {
    if (!this.vehicle?.id) return;

    try {
      const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: '¿Estás seguro de que deseas eliminar este vehículo? Esta acción no se puede deshacer.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      });

      if (result.isConfirmed) {
        const success = await this.vehicleService.deleteVehicle(this.vehicle.id);
        
        if (success) {
          Swal.fire(
            'Eliminado',
            'El vehículo ha sido eliminado correctamente.',
            'success'
          ).then(() => {
            this.globalService.setRoute('dashboard');
            this.globalService.dashboardOption = 'by-budget';
            this.vehicle = null;
            this.globalService.params = {};
            this.globalService.vehicle = null;
          });
        } else {
          Swal.fire(
            'Error',
            'No se pudo eliminar el vehículo.',
            'error'
          );
        }
      }
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      Swal.fire(
        'Error',
        'Ocurrió un error al eliminar el vehículo.',
        'error'
      );
    }
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

    copyLink(): void {
      const vehicleId = this.globalService.vehicle?.id;
      if (!vehicleId) return;
  
      const url = `${window.location.origin}/?vehicleId=${vehicleId}`;
      
      // Copiar al portapapeles
      navigator.clipboard.writeText(url).then(() => {
        Swal.fire({
          icon: 'success',
          title: '¡Enlace copiado!',
          text: 'El enlace se ha copiado al portapapeles',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'colored-toast'
          }
        });
      }).catch(err => {
        console.error('Error al copiar:', err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo copiar el enlace',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          customClass: {
            popup: 'colored-toast'
          }
        });
      });
    }
   


    async generatePDF() {
      // Mostrar notificación de carga
      const loadingToast = Swal.fire({
          title: 'Generando PDF...',
          html: 'Por favor, espere...',
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
              Swal.showLoading();
          }
      });
  
      try {
          // Ocultar elementos no deseados y mostrar el grid
          const swiper = document.querySelector('.swiper') as HTMLElement;
          const pdfGrid = document.querySelector('.pdf-grid') as HTMLElement;
          const elementsToHide = document.querySelectorAll('.exclude-from-pdf');
          elementsToHide.forEach(el => (el as HTMLElement).style.display = 'none');
          if (swiper && pdfGrid) {
              swiper.style.display = 'none';
              pdfGrid.style.display = 'block';
          }
  
          const element = document.getElementById('pdf-content');
  
          if (!element) {
              console.error('No se encontró el elemento con id "pdf-content"');
              throw new Error('No se encontró el contenido para generar el PDF');
          }
  
          const canvas = await html2canvas(element as HTMLElement, {
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
          
          // Mostrar notificación de éxito
          Swal.fire({
              icon: 'success',
              title: 'PDF generado',
              text: 'El PDF se ha generado correctamente',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              customClass: {
                  popup: 'colored-toast'
              }
          });
  
          pdf.save(`Detalle_${this.globalService.vehicle?.name?.replace(/\s+/g, '_') ?? 'vehiculo'}.pdf`);
      
          // Restaurar visibilidad original
          if (swiper && pdfGrid) {
              swiper.style.display = 'block';
              pdfGrid.style.display = 'none';
          }
      
          elementsToHide.forEach(el => (el as HTMLElement).style.display = 'block');
      
      } catch (error) {
          console.error('Error al generar el PDF:', error);
          // Mostrar notificación de error
          Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo generar el PDF',
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              customClass: {
                  popup: 'colored-toast'
              }
          });
      } finally {
        Swal.close();
          // Cerrar la notificación de carga
      
      }
  }
    // Agrega esta función para dividir las imágenes en filas de 3
    get imageRows(): any[][] {
      const images = this.globalService.vehicle?.files || [];
      const rows = [];
      for (let i = 0; i < images.length; i += 3) {
        rows.push(images.slice(i, i + 3));
      }
      return rows;
    }
    
  }
