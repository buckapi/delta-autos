import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { VEHICLE_TYPES, VehicleType } from '../../constants/vehicle.constants'; // Adjust the import path as necessary
import { GlobalService } from '../../services/global.service';
import { AddVehicleComponent } from '../add-vehicle/add-vehicle.component';
import { ByBudgetComponent } from '../by-budget/by-budget.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule,
    AddVehicleComponent,
    ByBudgetComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  vehicleTypes: VehicleType[] = []; // Initialize the vehicle types array
  constructor(public globalService: GlobalService, public authService: AuthService) { }

  ngOnInit() {
    this.vehicleTypes = this.getVehicleTypes(); // Fetch the vehicle types
  }

  getVehicleTypes(): VehicleType[] {
    return Object.values(VEHICLE_TYPES); // Return the values from VEHICLE_TYPES
  }
}
