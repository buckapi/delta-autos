import { Injectable } from '@angular/core';
import PocketBase from 'pocketbase';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private pb: PocketBase;

  constructor(private globalService: GlobalService) {
    this.pb = new PocketBase('https://db.buckapi.lat:8045');
    // Opcional: Restaurar sesión si existe token
    this.restoreAuth();
  }

  private restoreAuth() {
    const token = localStorage.getItem('pb_auth_token');
    if (token) {
      this.pb.authStore.save(token, this.getUser());
    }
  }

  async login(username: string, password: string): Promise<{ 
    success: boolean; 
    record?: any; 
    error?: string 
  }> {
    try {
      const authData = await this.pb.collection('users').authWithPassword(username, password);
      
      // Guardar el token y datos del usuario
      localStorage.setItem('pb_auth_token', authData.token);
      localStorage.setItem('user_id', authData.record.id);
      
      return {
        success: true,
        record: authData.record
      };
    } catch (error) {
      let errorMessage = 'Error desconocido';
      if (error instanceof Error) {
        errorMessage = error.message;
        // Mejorar mensajes de error para el usuario
        if (errorMessage.includes('Failed to fetch')) {
          errorMessage = 'Error de conexión con el servidor';
        } else if (errorMessage.includes('Invalid credentials')) {
          errorMessage = 'Usuario o contraseña incorrectos';
        }
      }
      return {
        success: false,
        error: errorMessage
      };
    }
  }

  isLogged(): boolean {
    return localStorage.getItem('pb_auth_token') !== null;
  }
  logout() {
    this.pb.authStore.clear();
    localStorage.removeItem('pb_auth_token');
    localStorage.removeItem('user_id');
    this.globalService.setRoute('home');
  }

  isAuthenticated(): boolean {
    return this.pb.authStore.isValid;
  }

  getUserId(): string | null {
    return this.pb.authStore.model?.id || localStorage.getItem('user_id');
  }

  getUser(): any {
    return this.pb.authStore.model;
  }

  getToken(): string | null {
    return this.pb.authStore.token;
  }
}