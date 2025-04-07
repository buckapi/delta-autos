// interfaces/vehicle.interface.ts
import { VehicleType, FuelType, TransmissionType, TractionType } from '../constants/vehicle.constants';
import { Brand, Model, BodyType } from '../types/vehicle-types.interface';

export interface vehicleTypeSelected {
  id: string;
  name: string;
}
export interface Vehicle {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  patent?: string;
  year?: number;
  color?: string;
  mileage?: string;
  seats?: number;
  doors?: number;
  cylinder?: number;
  vehicleTypeSelected?: any; 

  /* Tipos fijos (usando constantes) */
  vehicleType?: VehicleType;
  // vehicleType?: VehicleType;

  fuelType?: FuelType;
  transmissionType?: TransmissionType;
  tractionType?: TractionType;

  /* Tipos dinámicos (arrays desde BD) */
  // brand?: Brand[];
  brand?: string;
  model?: Model[];
  bodyType?: BodyType[];

  /* Otros campos flexibles */
  files?: any; // Reemplazar por interfaz específica si es necesario
}