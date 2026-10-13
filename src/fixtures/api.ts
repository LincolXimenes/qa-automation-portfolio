import { test as base } from '@playwright/test';
import { BookerClient } from '@api/BookerClient';
import type { BookingCreated } from '@api/types';
import { buildBooking } from '@api/bookingFactory';

type ApiFixtures = {
  booker: BookerClient;
  /** Cliente já autenticado com as credenciais públicas do Restful-Booker. */
  authedBooker: BookerClient;
  /** Reserva criada para o teste e removida ao final (limpeza garantida). */
  booking: BookingCreated;
};

export const test = base.extend<ApiFixtures>({
  booker: async ({ request }, use) => use(new BookerClient(request)),
  authedBooker: async ({ request }, use) => {
    const client = new BookerClient(request);
    await client.authenticate(
      process.env.API_USER ?? 'admin',
      process.env.API_PASSWORD ?? 'password123',
    );
    await use(client);
  },
  booking: async ({ authedBooker }, use) => {
    const created = await authedBooker.createAndParse(buildBooking());
    await use(created);
    await authedBooker.remove(created.bookingid); // limpeza; ignora se o teste já apagou
  },
});

export { expect } from '@playwright/test';
