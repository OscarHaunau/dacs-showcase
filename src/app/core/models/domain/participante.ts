export class Participante {
  constructor(
    public id: string,
    public nombre: string,
    public dni: string,
    public email: string,
    public telefono: string,
  ) {}

  registrarParticipante(id: string, dni: string, email: string, telefono: string): void {
    this.id = id;
    this.dni = dni;
    this.email = email;
    this.telefono = telefono;
  }

  verificarEmailValido(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}