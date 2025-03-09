import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../enviroments/environment';
import { Businessman } from '../models/businessman.model';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root',
})
export class BusinessmanService {
  private apiUrl = `${environment.apiUrl}/Businessman`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los headers con el token de autenticación
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // Obtener lista de comerciantes paginada
  getBusinessmen(page: number, pageSize: number): Observable<Businessman[]> {
    return this.http.get<Businessman[]>(`${this.apiUrl}?page=${page}&pageSize=${pageSize}`, { headers: this.getAuthHeaders() });
  }

  // Obtener comerciante por ID
  getBusinessmanById(id: number): Observable<Businessman> {
    return this.http.get<Businessman>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Crear nuevo comerciante
  createBusinessman(businessman: Partial<Businessman>): Observable<Businessman> {
    return this.http.post<Businessman>(this.apiUrl, businessman, { headers: this.getAuthHeaders() });
  }

  // Actualizar comerciante
  updateBusinessman(id: number, businessman: Partial<Businessman>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, businessman, { headers: this.getAuthHeaders() });
  }

  // Cambiar estado (activar/inactivar)
  updateStatus(id: number, newStatus: string): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/status`, { 
      bus_Status: newStatus, 
      bus_Name: "1", 
      bus_Phone_Number: "1",
      bus_Email: "1", 
      bus_Municipality: "1" 
    }, { headers: this.getAuthHeaders() });
  }

  // Eliminar comerciante (Solo administradores)
  deleteBusinessman(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  // Descargar Reporte CSV (Solo administradores)
  downloadReport(): void {
    if (this.authService.getUserRole() !== 'Administrador') {
      alert('No tienes permisos para descargar el reporte.');
      return;
    }

    this.http.get(`${this.apiUrl}/report`, { 
      headers: this.getAuthHeaders(), 
      responseType: 'blob' 
    }).subscribe((response) => {
      const blob = new Blob([response], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Businessmen_Report.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
  }
}
