# QA Automation Portfolio

[![Testes](https://github.com/LincolXimenes/qa-automation-portfolio/actions/workflows/tests.yml/badge.svg)](https://github.com/LincolXimenes/qa-automation-portfolio/actions/workflows/tests.yml)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

Projeto de automação de testes que demonstra **Playwright + TypeScript com Page Object Model** para interface e **testes de API** com cliente tipado, fixtures e execução em CI.

Os testes rodam contra sites públicos criados para treino, então qualquer pessoa pode clonar e executar sem configurar nada:

| Camada | Alvo                                                   | O que cobre                                     |
| ------ | ------------------------------------------------------ | ----------------------------------------------- |
| UI     | [Sauce Demo](https://www.saucedemo.com)                | Login, catálogo, ordenação, carrinho e checkout |
| API    | [Restful-Booker](https://restful-booker.herokuapp.com) | Autenticação e CRUD de reservas                 |

## Como rodar

```bash
npm install
npx playwright install chromium
npm test                 # tudo
npm run test:smoke       # só os casos @smoke
npm run test:regression  # só os casos @regression
npm run test:ui          # só interface
npm run test:api         # só API
npm run report           # abre o relatório HTML
```

Requer Node 20 ou superior. As variáveis opcionais estão em `.env.example` (todas têm padrão).

## Estratégia

- **Smoke:** poucos casos críticos que respondem "o sistema está de pé?" (login, compra completa, criar e consultar reserva). Rodam a cada push.
- **Regressão:** validações negativas, ordenação, atualização parcial, remoção e demais regras. Rodam sob demanda no pipeline.
- **Independência:** cada teste cria e limpa a própria massa de dados (as reservas de API têm limpeza automática na fixture). Nenhum teste depende da execução de outro.
- **Rastreabilidade:** o ID do caso (`TC-UI-xxx`, `TC-API-xxx`) está no título do teste e na tabela abaixo.

## Arquitetura

```text
src/
  pages/        Page Objects (BasePage, LoginPage, InventoryPage, CartPage, CheckoutPage)
  api/          BookerClient (cliente tipado), tipos e fábrica de dados
  fixtures/     Fixtures do Playwright (ui.ts e api.ts) com injeção de páginas e clientes
  data/         Dados de teste
tests/
  ui/           Especificações de interface
  api/          Especificações de API
.github/workflows/tests.yml   Pipeline de CI
```

Decisões de projeto:

- **Page Object Model:** seletores e ações ficam nas páginas; os testes só descrevem comportamento.
- **Locators por `data-test`:** o Sauce Demo expõe esse atributo, configurado em `testIdAttribute`, o que torna os seletores estáveis.
- **Fixtures em vez de `beforeEach`:** `authenticated` entrega a lista de produtos já logada, e `booking` cria uma reserva e a remove ao final.
- **Cliente de API tipado:** `BookerClient` concentra endpoints, token e cabeçalhos.
- **Projetos separados (`ui` e `api`):** rodam e falham de forma independente, inclusive no CI.

## Casos de teste

| ID                    | Descrição                                         | Tag        |
| --------------------- | ------------------------------------------------- | ---------- |
| TC-UI-001             | Login válido abre a lista de produtos             | smoke      |
| TC-UI-002             | Senha incorreta exibe erro                        | regression |
| TC-UI-003             | Usuário bloqueado não entra                       | regression |
| TC-UI-004 / 005       | Usuário e senha obrigatórios                      | regression |
| TC-UI-006             | Acesso direto ao inventário sem login é bloqueado | regression |
| TC-UI-010             | Lista exibe os 6 produtos                         | smoke      |
| TC-UI-011 / 012 / 013 | Ordenação por preço e por nome                    | regression |
| TC-UI-014             | Contador do carrinho ao adicionar e remover       | regression |
| TC-UI-020             | Compra completa de um produto                     | smoke      |
| TC-UI-021             | Produto adicionado aparece no carrinho            | regression |
| TC-UI-022 / 023       | Checkout exige nome e CEP                         | regression |
| TC-API-001            | Ping da API                                       | smoke      |
| TC-API-002            | Credenciais válidas retornam token                | smoke      |
| TC-API-003            | Credenciais inválidas não retornam token          | regression |
| TC-API-004            | Remover sem autenticação é negado                | regression |
| TC-API-010            | Criar reserva                                     | smoke      |
| TC-API-011            | Consultar reserva                                 | smoke      |
| TC-API-012            | Listagem inclui a reserva criada                  | regression |
| TC-API-013            | Atualização total (PUT)                           | regression |
| TC-API-014            | Atualização parcial (PATCH)                       | regression |
| TC-API-015            | Reserva removida deixa de existir                 | regression |
| TC-API-016            | Id inexistente retorna 404                        | regression |
| TC-API-017            | Filtro por nome                                   | regression |

## Pipeline

O workflow `Testes` roda em todo push e pull request: primeiro verificação de tipos e lint, depois os projetos `ui` e `api` em paralelo, com o relatório HTML publicado como artefato. Em execução manual (`workflow_dispatch`) é possível escolher `smoke`, `regression` ou `all`.

## Observações

Os alvos são serviços públicos compartilhados e podem oscilar. Por isso o CI usa duas tentativas (`retries`) e o Playwright guarda trace, captura de tela e vídeo apenas quando um teste falha. As credenciais usadas são as públicas dos próprios sites de demonstração.

## Próximos passos

- Testes contra a API do projeto [pastelaria-pdv](https://github.com/LincolXimenes/pastelaria-pdv).
- Testes visuais e de acessibilidade.
- Execução em múltiplos navegadores.

## Autor

Lincoln Ximenes — [LinkedIn](https://www.linkedin.com/in/lincoln-ximenes-1a151393/)
