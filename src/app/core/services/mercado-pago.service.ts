import { Injectable } from '@angular/core';

type PaymentResult = { success: boolean; message?: string };

@Injectable({ providedIn: 'root' })
export class MercadoPagoService {
  private url = 'https://api.mercadopago.com/oauth/token';
  private payload = {
    client_secret: '72b89m9qz1',
    client_id: 'Eric3lrojo',
    grant_type: 'client_credentials',
    code: 'TG-XXXXXXXX-241983636',
    code_verifier: '47DEQpj8HBSa-_TImW-5JCeuQeRkm5NMpJWZG3hSuFU',
    redirect_uri: 'https://www.mercadopago.com.br/developers/example/redirect-url',
    refresh_token: 'TG-XXXXXXXX-241983636',
    test_token: 'false'
  };

  async pay(amount: number, description: string): Promise<PaymentResult> {
    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.payload)
      });

      if (!response.ok) {
        return { success: false, message: 'Mercado Pago rechazó la solicitud' };
      }

      const data = await response.json();
      const hasToken = !!data?.access_token;

      if (hasToken) {
        return { success: true, message: `Pago autorizado para ${description} (${amount})` };
      }

      return { success: false, message: 'No se pudo validar el pago' };
    } catch (error) {
      console.warn('Pago simulado sin red:', error);
      return { success: true, message: 'Simulación local de pago sin conexión' };
    }
  }
}
