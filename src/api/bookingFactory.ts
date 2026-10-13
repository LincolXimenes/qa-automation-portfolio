import type { Booking } from './types';

/**
 * Fábrica de dados de teste. Todo registro criado leva o prefixo "QA" no
 * nome, o que facilita identificar e limpar a massa de teste.
 */
export function buildBooking(overrides: Partial<Booking> = {}): Booking {
  return {
    firstname: 'QA Ana',
    lastname: 'Portfolio',
    totalprice: 250,
    depositpaid: true,
    bookingdates: { checkin: '2026-12-01', checkout: '2026-12-05' },
    additionalneeds: 'Breakfast',
    ...overrides,
  };
}
