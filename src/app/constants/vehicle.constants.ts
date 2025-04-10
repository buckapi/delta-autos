// constants/vehicle.constants.ts

/* Tipos de Vehículo */
export const VEHICLE_TYPES = {
  TODOS: {
    id: "a2sfnr9nmcqzhbt",
    name: "Todos",
  },  
  ORIGINAL: {
    id: "a2sfnr9nmcqzhbp",
    name: "Vehículos de línea original",
  },
  REPAIRED_SALVAGE: {
    id: "k5mgnr7plbqxwvy",
      name: "Vehículos de salvamento reparados",
    },
    UNREPAIRED_SALVAGE: {
      id: "r9tqzn2sfncmhbp",
      name: "Vehículos de salvamento sin reparar",
    },
    MOTORCYCLES: {
      id: "p3dknr5mjqszwvy",
      name: "Motos",
    },
  } as const;
  
  /* Tipos de Combustible */
  export const FUEL_TYPES = {
    GASOLINE: {
      id: "g7sdnr2klmqxwvy",
      name: "Gasolina",
    },
    DIESEL: {
      id: "d4jgnr9plbqzxyv",
      name: "Diésel",
    },
    ELECTRIC: {
      id: "e9tqzn2sfncmhbp",
      name: "Eléctrico",
    },
    HYBRID: {
      id: "h5mgnr7plbqxwvy",
      name: "Híbrido",
    },
  } as const;
  
  /* Tipos de Transmisión */
  export const TRANSMISSION_TYPES = {
    MANUAL: {
      id: "m2sfnr9nmcqzhbp",
      name: "Manual",
    },
    AUTOMATIC: {
      id: "a5mgnr7plbqxwvy",
      name: "Automática",
    },
    CVT: {
      id: "c9tqzn2sfncmhbp",
      name: "CVT",
    },
    DUAL_CLUTCH: {
      id: "d3dknr5mjqszwvy",
      name: "Doble Embrague",
    },
  } as const;
  
  /* Tipos de Tracción */
  export const TRACTION_TYPES = {
    FWD: {
      id: "f2sfnr9nmcqzhbp",
      name: "Tracción delantera",
    },
    RWD: {
      id: "r5mgnr7plbqxwvy",
      name: "Tracción trasera",
    },
    AWD: {
      id: "a9tqzn2sfncmhbp",
      name: "Tracción total",
    },
  } as const;
  
  export const WHATSAPP_NUMBER = '+573233036339';

  /* Tipos para TypeScript (derivados de las constantes) */
  export type VehicleType = typeof VEHICLE_TYPES[keyof typeof VEHICLE_TYPES];
  export type FuelType = typeof FUEL_TYPES[keyof typeof FUEL_TYPES];
  export type TransmissionType = typeof TRANSMISSION_TYPES[keyof typeof TRANSMISSION_TYPES];
  export type TractionType = typeof TRACTION_TYPES[keyof typeof TRACTION_TYPES];