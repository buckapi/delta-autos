import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
activeRoute:string ="home" ;
dashboardOption:string="";
params: any = {};
setRoute(route:string, params?: any){
        this.activeRoute = route;
        this.params = params || {};
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