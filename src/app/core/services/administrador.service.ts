import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdministradorDto } from '../models/dto/administrador-dto';

@Injectable({ providedIn: 'root' })
export class AdministradorService {
  private baseUrl = `${environment.backendForFrontendUrl}/administrador`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<AdministradorDto[]> {
    return this.http.get<AdministradorDto[]>(this.baseUrl);
  }

  getById(id: number | string): Observable<AdministradorDto> {
    return this.http.get<AdministradorDto>(`${this.baseUrl}/${id}`);
  }

  create(administrador: AdministradorDto): Observable<AdministradorDto> {
    return this.http.post<AdministradorDto>(this.baseUrl, administrador, this.getOptions());
  }

  update(administrador: AdministradorDto): Observable<AdministradorDto> {
    return this.http.put<AdministradorDto>(this.baseUrl, administrador, this.getOptions());
  }

  delete(id: number | string): Observable<void | AdministradorDto> {
    return this.http.delete<void | AdministradorDto>(`${this.baseUrl}/${id}`);
  }

  private getOptions() {
    return { headers: { 'Content-Type': 'application/json' } };
  }
}
