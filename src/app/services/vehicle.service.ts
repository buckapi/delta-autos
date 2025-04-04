// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; // Asegúrate de importar map
import { GlobalService } from './global.service';
import PocketBase from 'pocketbase'; // Import PocketBase

import { Vehicle } from '../interfaces/vehicle.interface';
@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  baseUrl: string;
  private pb: PocketBase; // Add PocketBase instance

  constructor(
    // private http: HttpClient,
    private fb: FormBuilder,
    public global: GlobalService
  ) {
    this.pb = new PocketBase('https://db.buckapi.lat:8045'); // Initialize PocketBase

    this.baseUrl = 'https://db.buckapi.lat:8050';
  }

  addVehicle(data: Vehicle): Promise<Vehicle> {
    return this.pb.collection('vehicles').create(data);
}

}