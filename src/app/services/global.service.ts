import { Injectable } from '@angular/core';
import { Vehicle } from '../interfaces/vehicle.interface';
import { RealtimeVehiclesService } from './realtime-vehicles.service';
import { VEHICLE_TYPES, VehicleType } from '../constants/vehicle.constants';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { WHATSAPP_NUMBER } from '../constants/vehicle.constants';
import { Observable } from 'rxjs';
export const VEHICLE_TYPES_MAP = Object.values(VEHICLE_TYPES).reduce((acc, type) => {
  acc[type.id] = type;
  return acc;
}, {} as Record<string, VehicleType>);
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  searchTerm: string = "";
  vehicle: Vehicle | null = null;
  activeRoute: string = "home";
  dashboardOption: string = "";
  params: any = {};
  vehicleTypeSelected: boolean = false;
  typeIdSelected: string = VEHICLE_TYPES.TODOS.id;
  whatsappNumber = WHATSAPP_NUMBER;
  isModalOpen=false;

constructor(
  private sanitizer: DomSanitizer,
  public realtimeVehiclesService: RealtimeVehiclesService) {
    this.realtimeVehiclesService.vehiclesSubject.subscribe(() => {  
      this.initializeState();
    });
    this.initializeState();
}
private saveState() {
  localStorage.setItem('state', JSON.stringify({
    activeRoute: this.activeRoute,
    dashboardOption: this.dashboardOption,
    vehicleId: this.params?.id
  }));
}

private loadState() {
  const savedState = localStorage.getItem('state');
  if (savedState) {
    const state = JSON.parse(savedState);
    this.activeRoute = state.activeRoute;
    this.dashboardOption = state.dashboardOption;
    
    // Cargar el vehículo si hay un ID guardado
    if (state.vehicleId) {
      console.log('Recuperando vehículo con ID:', state.vehicleId);
      this.params = { id: state.vehicleId };
      this.vehicle = this.realtimeVehiclesService.getVehicleById(state.vehicleId);
      console.log('Vehículo recuperado:', this.vehicle);
    }
  }
}
  setRoute(route: string, params?: any) {
    this.activeRoute = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if(route === 'dashboard') {
      this.dashboardOption = 'by-budget';
    }

    this.params = params || {};
    if (params?.id && route === 'car-detail') {
      this.dashboardOption = 'car-detail';
      this.vehicle = this.realtimeVehiclesService.getVehicleById(params.id);
      console.log(this.vehicle);
    }
    this.saveState();
  }
initializeState() {
  this.loadState();
}

isSessionActive(): boolean {
  return !!localStorage.getItem('pb_auth_token');
}

setDashboardOption(option: string) {
  this.dashboardOption = option;
  this.saveState(); // Guardar el estado después de cada cambio
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
  // console.log("whatsapp url", url);
  return this.sanitizer.bypassSecurityTrustUrl(url);
}

  getWhatsAppMessage(): string {
    if (!this.vehicle) return '';
    const message = `¡Hola! Me interesa el vehículo:
Nombre: ${this.vehicle.brand || 'Sin especificar'}
Descripcion: ${this.vehicle.description || 'Sin especificar'}
Año: ${this.vehicle.year || 'Sin especificar'}
Precio: $${this.vehicle.price?.toLocaleString() || 'Sin especificar'}
¿Podrías darme más información sobre este vehículo?
Gracias!`;
    return encodeURIComponent(message);
  }
  } 