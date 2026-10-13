import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { Booking, BookingCreated } from './types';

/**
 * Cliente tipado para o Restful-Booker. Isola endpoints, autenticação e
 * cabeçalhos para que os testes descrevam apenas o comportamento esperado.
 */
export class BookerClient {
  private token?: string;

  constructor(private readonly request: APIRequestContext) {}

  ping(): Promise<APIResponse> {
    return this.request.get('/ping');
  }

  /** Retorna a resposta crua para permitir testar também credenciais inválidas. */
  authRaw(username: string, password: string): Promise<APIResponse> {
    return this.request.post('/auth', { data: { username, password } });
  }

  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.authRaw(username, password);
    const body = (await response.json()) as { token?: string };
    if (!body.token) throw new Error('Autenticação falhou: token ausente na resposta.');
    this.token = body.token;
    return this.token;
  }

  create(booking: Booking): Promise<APIResponse> {
    return this.request.post('/booking', { data: booking });
  }

  async createAndParse(booking: Booking): Promise<BookingCreated> {
    const response = await this.create(booking);
    return (await response.json()) as BookingCreated;
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/booking/${id}`);
  }

  list(filters: Record<string, string> = {}): Promise<APIResponse> {
    return this.request.get('/booking', { params: filters });
  }

  update(id: number, booking: Booking): Promise<APIResponse> {
    return this.request.put(`/booking/${id}`, { data: booking, headers: this.authHeaders() });
  }

  patch(id: number, partial: Partial<Booking>): Promise<APIResponse> {
    return this.request.patch(`/booking/${id}`, { data: partial, headers: this.authHeaders() });
  }

  remove(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`, { headers: this.authHeaders() });
  }

  /** Remove sem autenticação — usado para validar a regra de acesso. */
  removeWithoutAuth(id: number): Promise<APIResponse> {
    return this.request.delete(`/booking/${id}`);
  }

  private authHeaders(): Record<string, string> {
    if (!this.token) throw new Error('Chame authenticate() antes de operações protegidas.');
    return { Cookie: `token=${this.token}` };
  }
}
