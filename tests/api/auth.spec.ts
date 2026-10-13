import { test, expect } from '@fixtures/api';

test.describe('Autenticação e saúde da API', () => {
  test('TC-API-001 ping responde que a API está no ar @smoke', async ({ booker }) => {
    const response = await booker.ping();
    expect(response.status()).toBe(201);
  });

  test('TC-API-002 credenciais válidas retornam um token @smoke', async ({ booker }) => {
    const response = await booker.authRaw(
      process.env.API_USER ?? 'admin',
      process.env.API_PASSWORD ?? 'password123',
    );
    expect(response.ok()).toBeTruthy();
    const body = await response.json();
    expect(typeof body.token).toBe('string');
    expect(body.token.length).toBeGreaterThan(5);
  });

  test('TC-API-003 credenciais inválidas não retornam token @regression', async ({ booker }) => {
    const response = await booker.authRaw('admin', 'senha-errada');
    const body = await response.json();
    expect(body.token).toBeUndefined();
    expect(body.reason).toBe('Bad credentials');
  });

  test('TC-API-004 remover sem autenticação é negado @regression', async ({ booker, booking }) => {
    const response = await booker.removeWithoutAuth(booking.bookingid);
    expect(response.status()).toBe(403);
  });
});
