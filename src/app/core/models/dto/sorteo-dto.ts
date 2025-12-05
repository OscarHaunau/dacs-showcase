export interface SorteoDto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precioNumero?: number; // Since TS doesn't have BigDecimal, use number (or string) as needed by backend
  modalidad?: string;
  fechaSorteo?: string; // ISO string
  estado?: boolean;
  administradorId?: number;
}
