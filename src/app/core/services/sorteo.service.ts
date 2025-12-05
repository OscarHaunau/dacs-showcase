import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SorteoDto } from '../models/dto/sorteo-dto';
import { NumeroDto } from '../models/dto/numero-dto';
import { PremioDto } from '../models/dto/premio-dto';

@Injectable({ providedIn: 'root' })
export class SorteoService {
  private baseUrl = `${environment.backendForFrontendUrl}/sorteo`;

  constructor(private http: HttpClient) {}

  getAllActive(): Observable<SorteoDto[]> {
    return this.http.get<SorteoDto[]>(this.baseUrl);
  }

  getById(id: number | string): Observable<SorteoDto> {
    return this.http.get<SorteoDto>(`${this.baseUrl}/${id}`);
  }

  getNumerosBySorteoId(sorteoId: number | string): Observable<NumeroDto[]> {
    return this.http.get<NumeroDto[]>(`${this.baseUrl}/numero/${sorteoId}`);
  }

  saveSorteo(sorteo: SorteoDto): Observable<SorteoDto> {
    return this.http.post<SorteoDto>(this.baseUrl, sorteo, this.getOptions());
  }

  deleteSorteo(id: number | string): Observable<void | SorteoDto> {
    return this.http.delete<void | SorteoDto>(`${this.baseUrl}/${id}`);
  }

  createPremio(premio: PremioDto): Observable<PremioDto> {
    return this.http.post<PremioDto>(`${this.baseUrl}/premio`, premio, this.getOptions());
  }

  getPremioById(id: number | string): Observable<PremioDto> {
    return this.http.get<PremioDto>(`${this.baseUrl}/premio/${id}`);
  }

  getPremiosBySorteoId(sorteoId: number | string): Observable<PremioDto[]> {
    return this.http.get<PremioDto[]>(`${this.baseUrl}/premio/sorteo/${sorteoId}`);
  }

  private getOptions() {
    return { headers: { 'Content-Type': 'application/json' } };
  }
}
