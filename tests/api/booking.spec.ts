import { test, expect } from '@fixtures/api';
import { buildBooking } from '@api/bookingFactory';
import type { Booking } from '@api/types';

test.describe('Reservas — CRUD', () => {
  test('TC-API-010 criar reserva retorna id e os dados enviados @smoke', async ({
    authedBooker,
  }) => {
    const payload = buildBooking({ firstname: 'QA Criar' });
    const created = await authedBooker.createAndParse(payload);

    expect(created.bookingid).toBeGreaterThan(0);
    expect(created.booking).toMatchObject(payload);

    await authedBooker.remove(created.bookingid);
  });

  test('TC-API-011 consultar reserva retorna os dados gravados @smoke', async ({
    authedBooker,
    booking,
  }) => {
    const response = await authedBooker.get(booking.bookingid);
    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toMatchObject(booking.booking);
  });

  test('TC-API-012 listagem inclui a reserva criada @regression', async ({
    authedBooker,
    booking,
  }) => {
    const response = await authedBooker.list();
    expect(response.status()).toBe(200);
    const ids = ((await response.json()) as { bookingid: number }[]).map((b) => b.bookingid);
    expect(ids).toContain(booking.bookingid);
  });

  test('TC-API-013 atualização total (PUT) substitui os dados @regression', async ({
    authedBooker,
    booking,
  }) => {
    const changed = buildBooking({ firstname: 'QA Atualizado', totalprice: 999 });
    const response = await authedBooker.update(booking.bookingid, changed);
    expect(response.status()).toBe(200);
    expect((await response.json()) as Booking).toMatchObject(changed);
  });

  test('TC-API-014 atualização parcial (PATCH) altera só os campos enviados @regression', async ({
    authedBooker,
    booking,
  }) => {
    const response = await authedBooker.patch(booking.bookingid, { lastname: 'QA Parcial' });
    expect(response.status()).toBe(200);
    const body = (await response.json()) as Booking;
    expect(body.lastname).toBe('QA Parcial');
    expect(body.firstname).toBe(booking.booking.firstname);
  });

  test('TC-API-015 reserva removida deixa de existir @regression', async ({
    authedBooker,
    booking,
  }) => {
    const removed = await authedBooker.remove(booking.bookingid);
    expect(removed.status()).toBe(201);

    const after = await authedBooker.get(booking.bookingid);
    expect(after.status()).toBe(404);
  });

  test('TC-API-016 consultar id inexistente retorna 404 @regression', async ({ booker }) => {
    const response = await booker.get(999999999);
    expect(response.status()).toBe(404);
  });

  test('TC-API-017 filtro por nome retorna a reserva criada @regression', async ({
    authedBooker,
    booking,
  }) => {
    const response = await authedBooker.list({ firstname: booking.booking.firstname });
    const ids = ((await response.json()) as { bookingid: number }[]).map((b) => b.bookingid);
    expect(ids).toContain(booking.bookingid);
  });
});
