
import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable } from 'rxjs';

import { Vehicle } from '../interfaces/vehicle.interface';


@Injectable({
  providedIn: 'root',
})
export class RealtimeVehiclesService implements OnDestroy {
  private pb: PocketBase;
  public VehiclesSubject = new BehaviorSubject<Vehicle[]>([]);

  // Observable for components to subscribe to
  public Vehicles$: Observable<Vehicle[]> =
    this.VehiclesSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8045');
    this.subscribeToVehicles();
  }
  getVehicleById(id: string): Vehicle | null {
    return this.VehiclesSubject.value.find((vehicle) => vehicle.id === id) || null;
  }
  // private async subscribeToVehicles() {
  //   try {
  //     await this.pb
  //       .collection('users')
  //       .authWithPassword('platform@buckapi.lat', 'cMKgSkrw9ifGhdv');

  //     this.pb.collection('Vehicles').subscribe('*', (e) => {
  //       this.handleRealtimeEvent(e);
  //     });

  //     this.updateVehiclesList();
  //   } catch (error) {
  //     console.error('Error during subscription:', error);
  //   }
  // }
  private async subscribeToVehicles() {
    try {
      // Subscribe to changes in any record of the 'Vehicles' collection
      this.pb.collection('Vehicles').subscribe('*', (e) => {
        this.handleRealtimeEvent(e);
      });

      // Initialize the list of Vehicles
      this.updateVehiclesList();
    } catch (error) {
      console.error('Error during subscription:', error);
    }
  }

  private handleRealtimeEvent(event: any) {
    console.log(`Event Action: ${event.action}`);
    console.log(`Event Record:`, event.record);

    // Update the list of Vehicles
    this.updateVehiclesList();
  }

  private async updateVehiclesList() {
    try {
      // Get the updated list of Vehicles
      const records = await this.pb.collection('Vehicles').getFullList<Vehicle>(200, {
        sort: '-created', // Sort by creation date
      });

      // Ensures each record conforms to pet structure
      const Vehicles = records.map((record: any) => ({
        ...record,
        images: Array.isArray(record.images) ? record.images : [],
        services: Array.isArray(record.services) ? record.services : [],
      })) as Vehicle[];

      this.VehiclesSubject.next(Vehicles);
    } catch (error) {
      console.error('Error updating Vehicles list:', error);
    }
  }

  ngOnDestroy() {
    // Unsubscribe when the service is destroyed
    this.pb.collection('Vehicles').unsubscribe('*');
  }
}
