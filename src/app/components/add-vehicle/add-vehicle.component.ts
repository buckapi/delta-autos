import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Brand, Model, BodyType, FuelType, TransmissionType, TractionType } from '../../types/vehicle-types.interface';
import { TRANSMISSION_TYPES,TRACTION_TYPES, FUEL_TYPES, VEHICLE_TYPES, VehicleType } from '../../constants/vehicle.constants';
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
  private apiUrl = 'https://db.buckapi.lat:8045';

  vehicleTypes: VehicleType[] = [];
  brands: Brand[] = [];
  models: Model[] = [];
  bodyTypes: BodyType[] = [];
  fuelTypes: FuelType[] = [];
  transmissionTypes: TransmissionType[] = [];
  tractionTypes: TractionType[] = [];

  vehicleForm: FormGroup;
  vehicle = {
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
    alert('Enviando datos...');
    // Check for selected image
    if (!this.selectedImage) {
      Swal.fire({
        title: 'Error!',
        text: 'Por favor, seleccione una imagen antes de guardar el producto.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    // Check for form validity
    if (!this.vehicleForm.valid) {
      const invalidFields = Object.keys(this.vehicleForm.controls)
        .filter(field => this.vehicleForm.get(field)?.invalid)
        .map(field => field.charAt(0).toUpperCase() + field.slice(1)) // Capitalize the field name
        .join(', ');
  
      Swal.fire({
        title: 'Error!',
        text: `Por favor, complete los siguientes campos: ${invalidFields}`,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return;
    }
  
    const formData = new FormData();
    formData.append('image', this.selectedImage);
  
    try {
      let newImageRecord: any = await this.pb.collection('files').create(formData);
      if (newImageRecord) {
        console.log('Imagen subida:', newImageRecord);
        const files: string[] = [
          this.apiUrl +
          '/api/files/' +
          newImageRecord.collectionId +
          '/' +
          newImageRecord.id +
          '/' +
          newImageRecord.image
        ];
  
        const vehicleData = {
          name: this.vehicle.name,
          vehicleType: this.vehicle.vehicleType,
          brand: this.vehicle.brand,
          model: this.vehicle.model,
          fuelType: this.vehicle.fuelType,
          transmissionType: this.vehicle.transmissionType,
          tractionType: this.vehicle.tractionType,
          year: this.vehicle.year,
          mileage: this.vehicle.mileage,
          color: this.vehicle.color,
          doors: this.vehicle.doors,
          seats: this.vehicle.seats,
          description: this.vehicle.description,
          price: this.vehicle.price ?? undefined, // Convert null to undefined
          cylinder: this.vehicle.cylinder ?? undefined, // Convert null to undefined
          files: files
      };
  
        await this.vehicleService.addVehicle(vehicleData);
  
        Swal.fire({
          title: 'Éxito!',
          text: 'Producto guardado con éxito!',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
  
        this.vehicleForm.reset();
        this.selectedImage = null;
      } else {
        Swal.fire({
          title: 'Error!',
          text: 'La imagen no se subió correctamente.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } catch (error) {
      Swal.fire({
        title: 'Error!',
        text: 'No se pudo agregar el producto.',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      console.error('Error al agregar el producto:', error);
    }
  }
  onImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePrev = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }
  onBrandChange(event: any){
    const id = event.target.value;
    this.models = this.models.filter(model => model.id === id);
  }
  onModelChange(event: any){
    const id = event.target.value;
    this.bodyTypes = this.bodyTypes.filter(bodyType => bodyType.id === id);
  }
  onBodyTypeChange(event: any){
    const id = event.target.value;
    this.fuelTypes = this.fuelTypes.filter(fuelType => fuelType.id === id);
  }
  onFuelTypeChange(event: any){
    const id = event.target.value;
    this.transmissionTypes = this.transmissionTypes.filter(transmissionType => transmissionType.id === id);
  }
  onTransmissionTypeChange(event: any){
    const id = event.target.value;
    this.tractionTypes = this.tractionTypes.filter(tractionType => tractionType.id === id);
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
