import { Injectable } from '@angular/core';
import { Vehicle } from '../interfaces/vehicle.interface';
import { RealtimeVehiclesService } from './realtime-vehicles.service';
import { VEHICLE_TYPES, VehicleType } from '../constants/vehicle.constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WHATSAPP_NUMBER } from '../constants/vehicle.constants';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  vehicle: Vehicle | null = null;
  activeRoute: string = "home";
  dashboardOption: string = "";
  params: any = {};
  vehicleTypeSelected: boolean = false;
  typeIdSelected: string = VEHICLE_TYPES.ORIGINAL.id;
  whatsappNumber = WHATSAPP_NUMBER;
  

constructor(
  private sanitizer: DomSanitizer,
  public realtimeVehiclesService: RealtimeVehiclesService) {
  
}
setRoute(route:string, params?: any){
        this.activeRoute = route;
          window.scrollTo({ top: 0, behavior: 'smooth' });

        this.params = params || {};
        if(params?.id && route === 'car-detail'){
          this.dashboardOption = 'car-detail';
          this.vehicle=this.realtimeVehiclesService.getVehicleById(params.id);
          console.log(this.vehicle);
        }
}
setDashboardOption(option:string){
        this.dashboardOption = option;
    }
    getVehicleType(id: string): VehicleType | null {
      return Object.values(VEHICLE_TYPES).find(type => type.id === id) || null;
    }
    getRoute(){
      return this.activeRoute;
    }
    getParams(){
      return this.params;
    }

getWhatsappUrl(): SafeUrl {
  if (!this.vehicle) return '';
  const message = this.getWhatsAppMessage();
  const url = `https://wa.me/${this.whatsappNumber}?text=${message}`;
  console.log("whatsapp url", url);

  return this.sanitizer.bypassSecurityTrustUrl(url);
}

  getWhatsAppMessage(): string {
    if (!this.vehicle) return '';
    const message = `¡Hola! Me interesa el vehículo:
Nombre: ${this.vehicle.name || 'Sin especificar'}
Descripcion: ${this.vehicle.description || 'Sin especificar'}
Año: ${this.vehicle.year || 'Sin especificar'}
Precio: $${this.vehicle.price?.toLocaleString() || 'Sin especificar'}
¿Podrías darme más información sobre este vehículo?
Gracias!`;
    return encodeURIComponent(message);
  }
  }