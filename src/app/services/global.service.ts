import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
activeRoute:string ="home" ;
setRoute(route:string){
        this.activeRoute = route;
}
}