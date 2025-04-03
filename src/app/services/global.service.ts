import { Injectable } from '@angular/core';
import { Vehicle } from '../interfaces/vehicle.interface';
import { RealtimeVehiclesService } from './realtime-vehicles.service';
@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  vehicle: Vehicle | null = null;
activeRoute:string ="home" ;
dashboardOption:string="";
params: any = {};
constructor(public realtimeVehiclesService: RealtimeVehiclesService) {
  
}
setRoute(route:string, params?: any){
        this.activeRoute = route;
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
    getRoute(){
      return this.activeRoute;
    }
    getParams(){
      return this.params;
    }
}