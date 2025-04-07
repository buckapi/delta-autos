import { Injectable, OnDestroy } from '@angular/core';
import PocketBase from 'pocketbase';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Vehicle } from '../interfaces/vehicle.interface';

@Injectable({
  providedIn: 'root',
})
export class RealtimeVehiclesService implements OnDestroy {
  private pb: PocketBase;
  public vehiclesSubject = new BehaviorSubject<Vehicle[]>([]);

  // Observable público para componentes
  public vehicles$: Observable<Vehicle[]> = this.vehiclesSubject.asObservable();

  constructor() {
    this.pb = new PocketBase('https://db.buckapi.lat:8045');
    this.subscribeToVehicles();
  }

  private async subscribeToVehicles() {
    try {
      // (Opcional) Autenticación si es necesaria
      // await this.pb.collection('users').authWithPassword('platform@buckapi.lat', 'tu_contraseña');

      // Suscribirse a cambios en la colección 'vehicles'
      this.pb.collection('vehicles').subscribe('*', (e) => {
        this.handleRealtimeEvent(e);
      });

      // Cargar datos iniciales
      this.updateVehiclesList();
    } catch (error) {
      console.error('Error en la suscripción:', error);
    }
  }

  private handleRealtimeEvent(event: { action: string; record: any }) {
    console.log('Evento recibido:', event.action, event.record);
    
    // Actualizar la lista completa cuando hay cambios
    this.updateVehiclesList();
  }

  private async updateVehiclesList() {
    try {
      const records = await this.pb.collection('vehicles').getFullList<Vehicle>(200, {
        sort: '-created',
        expand: 'brand' // Expandir relaciones si es necesario
      });
      
      // Normalizar los datos antes de emitirlos
      const normalizedVehicles = records.map(record => this.normalizeVehicle(record));
      this.vehiclesSubject.next(normalizedVehicles);
    } catch (error) {
      console.error('Error actualizando lista de vehículos:', error);
    }
  }

  private normalizeVehicle(vehicle: any): Vehicle {
    return {
      id: vehicle.id,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      vehicleTypeSelected: vehicle.vehicleTypeSelected,
      vehicleType: vehicle.vehicleType,
      description: vehicle.description,
      files: Array.isArray(vehicle.files) ? vehicle.files : [],
    };
  }

  // Método para obtener un vehículo por ID como Observable
  getVehicleById$(id: string): Observable<Vehicle | null> {
    return this.vehicles$.pipe(
      map(vehicles => vehicles.find(v => v.id === id) || null)
    );
  }

  // Método para obtener un vehículo por ID directamente
  getVehicleById(id: string): Vehicle | null {
    return this.vehiclesSubject.value.find(v => v.id === id) || null;
  }

  ngOnDestroy() {
    // Limpiar la suscripción al destruir el servicio
    this.pb.collection('vehicles').unsubscribe('*');
  }
}