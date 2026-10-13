import { test, expect } from '@fixtures/ui';
import { checkoutInfo } from '@data/users';

const PRODUCT = 'Sauce Labs Backpack';

test.describe('Carrinho e checkout', () => {
  test('TC-UI-020 compra completa de um produto @smoke', async ({
    authenticated,
    cartPage,
    checkoutPage,
  }) => {
    await authenticated.addToCart(PRODUCT);
    await authenticated.openCart();
    await cartPage.expectLoaded();
    await expect(cartPage.itemNames).toHaveText([PRODUCT]);

    await cartPage.startCheckout();
    await checkoutPage.fillInformation(checkoutInfo);
    await checkoutPage.expectOverview();
    await checkoutPage.finish();

    await expect(checkoutPage.completeHeader).toHaveText('Thank you for your order!');
  });

  test('TC-UI-021 produto adicionado aparece no carrinho @regression', async ({
    authenticated,
    cartPage,
  }) => {
    await authenticated.addToCart(PRODUCT);
    await authenticated.openCart();
    await expect(cartPage.items).toHaveCount(1);
  });

  test('TC-UI-022 checkout exige o primeiro nome @regression', async ({
    authenticated,
    cartPage,
    checkoutPage,
  }) => {
    await authenticated.addToCart(PRODUCT);
    await authenticated.openCart();
    await cartPage.startCheckout();
    await checkoutPage.fillInformation({ lastName: 'Teste', postalCode: '01310-100' });
    await expect(checkoutPage.error).toContainText('First Name is required');
  });

  test('TC-UI-023 checkout exige o CEP @regression', async ({
    authenticated,
    cartPage,
    checkoutPage,
  }) => {
    await authenticated.addToCart(PRODUCT);
    await authenticated.openCart();
    await cartPage.startCheckout();
    await checkoutPage.fillInformation({ firstName: 'Ana', lastName: 'Teste' });
    await expect(checkoutPage.error).toContainText('Postal Code is required');
  });
});
