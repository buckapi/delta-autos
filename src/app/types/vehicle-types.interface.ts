// types/vehicle-types.interface.ts

export interface IdNameBase {
    id: string;
    name: string;
  }
  
  /* Tipos dinámicos (se cargan desde la BD) */
  export interface Brand extends IdNameBase {}     // Marcas: Toyota, Ford
  export interface Model extends IdNameBase {}    // Modelos: Corolla, Mustang
  export interface BodyType extends IdNameBase {} // Carrocerías: Sedán, SUV
  export interface TractionType extends IdNameBase {} // Tracción: 4x4, 2x2
  export interface TransmissionType extends IdNameBase {} // Transmisión: Manual, Automática
  export interface VehicleType extends IdNameBase {} // Tipo de vehículo: Automóvil, Motocicleta
  export interface FuelType extends IdNameBase {} // Tipo de combustible: Gasolina, Diésel
