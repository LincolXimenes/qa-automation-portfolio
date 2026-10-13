import { test, expect } from '@fixtures/ui';
import { users } from '@data/users';

test.describe('Login', () => {
  test('TC-UI-001 login válido abre a lista de produtos @smoke', async ({
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, users.standard.password);
    await inventoryPage.expectLoaded();
  });

  test('TC-UI-002 senha incorreta exibe mensagem de erro @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, 'senha-errada');
    await expect(loginPage.error).toContainText('do not match any user');
  });

  test('TC-UI-003 usuário bloqueado não consegue entrar @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.lockedOut.username, users.lockedOut.password);
    await expect(loginPage.error).toContainText('locked out');
  });

  test('TC-UI-004 usuário é obrigatório @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login('', users.standard.password);
    await expect(loginPage.error).toContainText('Username is required');
  });

  test('TC-UI-005 senha é obrigatória @regression', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(users.standard.username, '');
    await expect(loginPage.error).toContainText('Password is required');
  });

  test('TC-UI-006 acesso direto ao inventário sem login é bloqueado @regression', async ({
    page,
    loginPage,
  }) => {
    await page.goto('/inventory.html');
    await expect(loginPage.error).toContainText('You can only access');
  });
});
