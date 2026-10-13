import { test, expect } from '@fixtures/ui';

test.describe('Catálogo de produtos', () => {
  test('TC-UI-010 lista exibe os 6 produtos @smoke', async ({ authenticated }) => {
    await expect(authenticated.items).toHaveCount(6);
  });

  test('TC-UI-011 ordenar por preço do menor para o maior @regression', async ({
    authenticated,
  }) => {
    await authenticated.sortBy('lohi');
    const prices = await authenticated.prices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('TC-UI-012 ordenar por preço do maior para o menor @regression', async ({
    authenticated,
  }) => {
    await authenticated.sortBy('hilo');
    const prices = await authenticated.prices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });

  test('TC-UI-013 ordenar por nome de Z a A @regression', async ({ authenticated }) => {
    await authenticated.sortBy('za');
    const names = await authenticated.names();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('TC-UI-014 adicionar e remover produto atualiza o contador do carrinho @regression', async ({
    authenticated,
  }) => {
    await authenticated.addToCart('Sauce Labs Backpack');
    await authenticated.addToCart('Sauce Labs Bike Light');
    await expect(authenticated.cartBadge).toHaveText('2');

    await authenticated.removeFromCart('Sauce Labs Backpack');
    await expect(authenticated.cartBadge).toHaveText('1');
  });
});
