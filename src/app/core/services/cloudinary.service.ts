
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, throwError } from 'rxjs';

interface CloudinaryUploadResponse {
  secure_url: string;
}

@Injectable({
  providedIn: 'root'
})
export class CloudinaryService {
  private http: HttpClient = inject(HttpClient);

  // --- CONFIGURACIÓN DE ENTORNO ---
  private readonly config = {
    // IMPORTANTE: Asegúrate de que 'de5lkj3mw' sea TU Cloud Name real.
    // Si tu cuenta es diferente, cambia este valor.
    cloudName: 'de5lkj3mw', 
    uploadPreset: 'pablo_cocina_preset' // Preset actualizado
  };

  uploadImage(file: File): Observable<string> {
    const url = `https://api.cloudinary.com/v1_1/${this.config.cloudName}/image/upload`;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', this.config.uploadPreset);
    // folder: Opcional, organiza las fotos en una carpeta dentro de Cloudinary
    formData.append('folder', 'pablo_cocina_menu'); 

    return this.http.post<CloudinaryUploadResponse>(url, formData).pipe(
      map(response => {
        if (!response || !response.secure_url) {
           throw new Error('Respuesta inválida de Cloudinary');
        }
        return response.secure_url;
      }),
      catchError(err => {
        console.error('Error detallado de Cloudinary:', err);
        return throwError(() => new Error('Falló la subida de imagen. Verifica el Cloud Name y el Preset.'));
      })
    );
  }
}
