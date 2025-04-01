import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand, Model, BodyType,  } from '../../types/vehicle-types.interface';
import { TRANSMISSION_TYPES,TRACTION_TYPES, FUEL_TYPES, VEHICLE_TYPES, VehicleType,FuelType,TransmissionType,TractionType} from '../../constants/vehicle.constants';
import { Vehicle } from '../../interfaces/vehicle.interface';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { FormsModule } from '@angular/forms'; // Añade esta importación
import { GlobalService } from '../../services/global.service';
import Swal from 'sweetalert2'; // Ensure you have this import for SweetAlert
import PocketBase from "pocketbase";
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-add-vehicle',
  imports: [CommonModule,
    FormsModule,       // Añade esto
    ReactiveFormsModule // Añade esto
  ],
  templateUrl: './add-vehicle.component.html',
  styleUrl: './add-vehicle.component.css'
})
export class AddVehicleComponent {
  private pb: PocketBase;
  selectedImages: { file: File, preview: string }[] = [];

  private apiUrl = 'https://db.buckapi.lat:8045';
vehicleTypeSelected:boolean = false;
  vehicleTypes: VehicleType[] = [];
  brands: Brand[] = [];
  models: Model[] = [];
  bodyTypes: BodyType[] = [];
  fuelTypes: FuelType[] = [];
  transmissionTypes: TransmissionType[] = [];
  tractionTypes: TractionType[] = [];

  vehicleForm: FormGroup;
  vehicle:Vehicle = {
    files: [],
    name: '',
    vehicleType: undefined,
    brand: undefined,
    model: undefined,
    bodyType: undefined,
    fuelType: undefined,
    transmissionType: undefined,
    tractionType: undefined,
    year: undefined,
    mileage: undefined,
    color: '',
    doors: undefined,
    seats: undefined,
    description: '',
    price: undefined,
    cylinder: undefined
};
  selectedImage: File | null = null;
  selectedImagePrev: string | null = null;

  constructor(
    public vehicleService: VehicleService,
      public globalService: GlobalService,
      public fb: FormBuilder
  ) {
    this.pb = new PocketBase(this.apiUrl);

    this.vehicleTypes = this.getVehicleTypes();
    this.fuelTypes = this.getFuelTypes();
    this.transmissionTypes = this.getTransmissionTypes();
    this.tractionTypes = this.getTractionTypes();
    this.vehicleForm = this.fb.group({
      name: [''],
      files: [''],
      vehicleType: [''],
      brand: [''],
      model: [''],
      bodyType: [''],
      fuelType: [''],
      transmissionType: [''],
      tractionType: [''],
      year: [''],
      mileage: [''],
      color: [''],
      doors: [''],
      seats: [''],
      description: [''],
      price: [''],
      cylinder: ['']
    });
  }
  async onSubmit() {
    if (this.selectedImages.length === 0) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, seleccione al menos una imagen antes de guardar el vehículo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    if (!this.vehicleForm.valid) {
      const invalidFields = Object.keys(this.vehicleForm.controls)
        .filter(field => this.vehicleForm.get(field)?.invalid)
        .map(field => field.charAt(0).toUpperCase() + field.slice(1))
        .join(', ');

      Swal.fire({
        title: 'Error!',
        text: `Por favor, complete los siguientes campos: ${invalidFields}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }

    try {
      const imageUrls: string[] = [];
      
      // Upload all selected images
      for (const image of this.selectedImages) {
        const formData = new FormData();
        formData.append('image', image.file);
        
        const newImageRecord = await this.pb.collection('files').create(formData);
        
        if (newImageRecord) {
          const imageUrl = `${this.apiUrl}/api/files/${newImageRecord.collectionId}/${newImageRecord.id}/${newImageRecord['image']}`;
          imageUrls.push(imageUrl);
        }
      }

      if (imageUrls.length === 0) {
        Swal.fire({
          title: 'Error!',
          text: 'No se pudieron subir las imágenes correctamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        return;
      }

      const vehicleData = {
        name: this.vehicle.name,
        vehicleType: this.vehicle.vehicleType,
        brand: this.vehicle.brand,
        model: this.vehicle.model,
        bodyType: this.vehicle.bodyType,
        fuelType: this.vehicle.fuelType,
        transmissionType: this.vehicle.transmissionType,
        tractionType: this.vehicle.tractionType,
        year: this.vehicle.year,
        mileage: this.vehicle.mileage,
        color: this.vehicle.color,
        doors: this.vehicle.doors,
        seats: this.vehicle.seats,
        description: this.vehicle.description,
        price: this.vehicle.price ?? undefined,
        cylinder: this.vehicle.cylinder ?? undefined,
        files: imageUrls
      };

      await this.vehicleService.addVehicle(vehicleData);

      Swal.fire({
        title: 'Éxito!',
        text: 'Vehículo guardado con éxito!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
      this.vehicleTypeSelected = false;
      this.vehicleForm.reset();
      this.selectedImages = [];
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo agregar el vehículo.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      console.error('Error al agregar el vehículo:', error);
    }
  }
  // onImageChange(event: any): void {
  //   const file = event.target.files[0];
  //   if (file) {
  //     this.selectedImage = file;
      
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.selectedImagePrev = e.target.result;
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }
  hasSelectedImages(): boolean {
    return this.selectedImages.length > 0;
  }
  isMotorcycle(): boolean {
    return this.vehicle.vehicleType?.id === VEHICLE_TYPES.MOTORCYCLES.id;
  }


   // Método para eliminar una imagen
   removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }
   // Método para subir imágenes corregido
   private async uploadImages(): Promise<string[]> {
    const imageUrls: string[] = [];
    
    for (const image of this.selectedImages) {
      try {
        const formData = new FormData();
        formData.append('image', image.file);
        
        const record = await this.pb.collection('files').create(formData);
        
        // Usar notación de corchetes para acceder a propiedades dinámicas
        if (record?.['image']) {
          const imageUrl = `${this.apiUrl}/api/files/${record['collectionId']}/${record['id']}/${record['image']}`;
          imageUrls.push(imageUrl);
        }
      } catch (error) {
        console.error('Error subiendo imagen:', error);
        throw new Error('Error al subir imágenes');
      }
    }
    
    return imageUrls;
  }
  onImageChange(event: any): void {
    const files = event.target.files;
    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImages.push({
            file: file,
            preview: e.target.result
          });
        };
        reader.readAsDataURL(file);
      }
    }
  }



  hoverCard(event: any) {
    event.currentTarget.style.transform = 'translateY(-5px)';
    event.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.15)';
}

unhoverCard(event: any) {
    event.currentTarget.style.transform = '';
    event.currentTarget.style.boxShadow = '';
}
  onVehicleTypeChange(type: VehicleType) {
    console.log(type); // Check what type is being passed
    this.vehicle.vehicleType = type; // Ensure this is a valid VehicleType
    this.vehicleForm.get('vehicleType')?.setValue(type);
    this.vehicleTypeSelected = true;                                        
  }

  onTransmissionTypeChange(type: TransmissionType){
    this.vehicle.transmissionType = type;
    this.vehicleForm.get('transmissionType')?.setValue(this.vehicle.transmissionType);
  }

  onFuelTypeChange(type: FuelType){
    this.vehicle.fuelType = type;
    this.vehicleForm.get('fuelType')?.setValue(this.vehicle.fuelType);
  }

  onTractionTypeChange(event: any){
    const tractionTypeId = event.target.value;
    this.vehicleForm.get('tractionType')?.setValue(tractionTypeId);
  }
  onYearChange(event: any){
    const year = event.target.value;
    this.vehicleForm.get('year')?.setValue(year);
  }
  onMileageChange(event: any){
    const mileage = event.target.value;
    this.vehicleForm.get('mileage')?.setValue(mileage);
  }
  onColorChange(event: any){
    const color = event.target.value;
    this.vehicleForm.get('color')?.setValue(color);
  }
  onDoorsChange(event: any){
    const doors = event.target.value;
    this.vehicleForm.get('doors')?.setValue(doors);
  }
  onSeatsChange(event: any){
    const seats = event.target.value;
    this.vehicleForm.get('seats')?.setValue(seats);
  }
  onDescriptionChange(event: any){
    const description = event.target.value;
    this.vehicleForm.get('description')?.setValue(description);
  }
  onPriceChange(event: any){
    const price = event.target.value;
    this.vehicleForm.get('price')?.setValue(price);
  }

  getVehicleTypes(): VehicleType[] {
    return Object.values(VEHICLE_TYPES); // Return the values from VEHICLE_TYPES
  }



  getFuelTypes(): FuelType[] {  
    return Object.values(FUEL_TYPES);
  }

  getTransmissionTypes(): TransmissionType[] {  
    return Object.values(TRANSMISSION_TYPES);
  }

  getTractionTypes(): TractionType[] {  
    return Object.values(TRACTION_TYPES);
  }



}
