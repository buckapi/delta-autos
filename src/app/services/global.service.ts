import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
activeRoute:string ="dashboard" ;
dashboardOption:string="";
setRoute(route:string){
        this.activeRoute = route;
}
setDashboardOption(option:string){
        this.dashboardOption = option;
    }
}