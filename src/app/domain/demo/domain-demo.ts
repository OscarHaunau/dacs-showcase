import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SorteoDomainService } from '../../core/services/sorteo-domain.service';
import { SorteoService } from '../../core/services/sorteo.service';
import { RaffleStateService } from '../../core/services/raffle-state.service';
import { MetodoPago } from '../../core/models/domain/enums';

@Component({
  selector: 'app-domain-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './domain-demo.html',
  styleUrls: ['./domain-demo.css']
})
export class DomainDemoComponent {
  // Crear sorteo
  nombrePremio = 'Televisor LED';
  descripcionPremio = '50 pulgadas, 4K';
  valorPremio = 500000;
  descripcionSorteo = 'Sorteo de verano';
  precioNumero = 1000;

  // Generar números
  inicial = 1;
  cantidad = 20;

  // Participante
  nombre = 'Juan Perez';
  dni = '30123456';
  email = 'juan@example.com';
  telefono = '1122334455';
  participanteId: string | null = null;

  // Compra
  numeroValor = 1;
  metodo = MetodoPago.MP;
  resultado?: { ok: boolean; mensaje: string; comprobante?: string };

  MetodoPago = MetodoPago;

  constructor(public dom: SorteoDomainService, private sorteoService: SorteoService, private state: RaffleStateService) {}

  crearSorteo() {
    // Save to backend using SorteoService
    const dto = {
      nombre: this.nombrePremio,
      descripcion: this.descripcionSorteo,
      precioNumero: Number(this.precioNumero),
    } as any;
    this.sorteoService.saveSorteo(dto).subscribe(() => {
      // Refresh state so list shows new sorteo
      this.state.refreshRaffles();
    });
  }

  generar() {
    this.dom.generarNumeros(Number(this.inicial), Number(this.cantidad));
  }

  registrarParticipante() {
    const p = this.dom.registrarParticipante(this.nombre, this.dni, this.email, this.telefono);
    this.participanteId = p.id;
  }

  comprar() {
    if (!this.participanteId) { this.registrarParticipante(); }
    this.resultado = this.dom.registrarCompra(this.participanteId!, Number(this.numeroValor), this.metodo);
  }
}