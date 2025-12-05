export interface NumeroDto {
  id?: number;
  valor: number;
  estado?: 'DISPONIBLE' | 'VENDIDO' | 'EN_PROCESO' | string;
  sorteoId?: number;
  compraId?: number;
}
