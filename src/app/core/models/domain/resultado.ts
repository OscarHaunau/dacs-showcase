import { FuenteOficial } from './fuente-oficial';

export class Resultado {
  constructor(
    public id: string,
    public numeroGanador: number,
    public numeroRespaldo: number,
    public fechaPublicacion: Date,
    public fuente?: FuenteOficial,
  ) {}

  notificarParticipantesCorreos(): void {
    // En frontend, esto sería una integración a un servicio; aquí dejamos stub
    console.log('Notificando participantes por correo del resultado', {
      ganador: this.numeroGanador,
      respaldo: this.numeroRespaldo,
    });
  }

  registrarGanador(numeroGanador: number, fuenteOficial: FuenteOficial): void {
    this.numeroGanador = numeroGanador;
    this.fuente = fuenteOficial;
    this.fechaPublicacion = new Date();
  }
}