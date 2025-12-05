import { SorteoDto } from '../models/dto/sorteo-dto';
import { Sorteo } from '../models/domain/sorteo';
import { Premio } from '../models/domain/premio';

export function mapSorteoDtoToDomain(dto: SorteoDto): Sorteo {
  const id = dto.id !== undefined ? String(dto.id) : `S-${Date.now()}`;
  const fecha = dto.fechaSorteo ? new Date(dto.fechaSorteo) : new Date();
  const premio = new Premio(`P-${dto.id ?? Date.now()}`, dto.nombre, dto.descripcion ?? '', 0);
  const sorteo = new Sorteo(
    id,
    dto.nombre,
    dto.descripcion ?? '',
    dto.precioNumero ?? 0,
    fecha,
    dto.estado ?? true,
    premio,
  );
  return sorteo;
}

export function mapDomainToSorteoDto(s: Sorteo): SorteoDto {
  return {
    id: Number(s.id.toString().replace(/^S-/, '')) || undefined,
    nombre: s.nombre,
    descripcion: s.descripcion,
    precioNumero: s.precioNumero,
    fechaSorteo: s.fechaPublicacion.toISOString(),
    estado: s.estado,
    administradorId: undefined,
  };
}
