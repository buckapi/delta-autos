import { Component } from '@angular/core';
import { GlobalService } from '../../services/global.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})
export class ContactComponent {
constructor(
  public globalService: GlobalService) {}

  sendWhatsApp(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    const name = formData.get('name');
    const email = formData.get('email');
    const phone = formData.get('tel');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Crear mensaje formateado para WhatsApp
    const whatsappMessage = 
      `*Nuevo mensaje de contacto*%0A
      %0A*Nombre: ${name}
      %0A*Email: ${email}
      %0A*Teléfono: ${phone}
      %0A*Asunto: ${subject}
      %0A*Mensaje: ${message}`;
    
    // Abrir WhatsApp con el mensaje
    window.open(`https://wa.me/573226411637?text=${whatsappMessage}`, '_blank');
    // Resetear el formulario después del envío
    this.resetForm();
  }
  resetForm() {
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.reset();
      // Limpiar todos los campos manualmente usando el tipo genérico correcto
      const inputs = Array.from(form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea'));
      inputs.forEach(input => {
        input.value = '';
      });
    }
  }
}