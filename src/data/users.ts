/**
 * Credenciais PÚBLICAS do Sauce Demo (exibidas na própria tela de login do site).
 * Podem ser sobrescritas por variáveis de ambiente, mas não há segredo aqui.
 */
export const users = {
  standard: {
    username: process.env.UI_USER ?? 'standard_user',
    password: process.env.UI_PASSWORD ?? 'secret_sauce',
  },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
} as const;

export const checkoutInfo = {
  firstName: 'Ana',
  lastName: 'Teste',
  postalCode: '01310-100',
} as const;
