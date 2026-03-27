# Playwright API Tests — Petstore

Automated API test suite for the [Swagger Petstore](https://petstore.swagger.io) built with **Playwright** and **TypeScript**.

No browser is involved — Playwright's built-in `APIRequestContext` handles all HTTP requests directly.

## Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

## Setup

```bash
git clone <repository-url>
cd playwright-api-tests
npm install
```

The tests run against the public Petstore API at `https://petstore.swagger.io/v2/`. No additional configuration is needed.

## Running the tests

```bash
# Run the full suite (7 tests)
npm test

# Run only Part 1 (pet CRUD + negative cases)
npm run test:part1

# Run only Part 2 (list available pets & create orders)
npm run test:part2

# Open the HTML report after a run
npm run report
```

## What the tests cover

### Part 1 — Pet CRUD (`tests/part1-pets.spec.ts`)

| Test | Description |
|------|-------------|
| Create 10 pets | Creates 5 `available`, 4 `pending`, 1 `sold`. Validates every field in the response matches what was sent. |
| Get the sold pet | Fetches the `sold` pet by ID and asserts all fields match. |
| GET non-existent pet returns 404 | Requests a pet with a fake ID and expects a `404` response. |
| DELETE a pet then GET returns 404 | Creates a pet, deletes it, then verifies a subsequent GET returns `404`. |

### Part 2 — Orders (`tests/part2-orders.spec.ts`)

| Test | Description |
|------|-------------|
| List available pets and save 5 | Calls `GET /pet/findByStatus?status=available`, filters to valid pets, and stores 5. |
| Create an order per pet | Creates one order for each of the 5 saved pets. Asserts `petId`, `quantity`, and `status`. |
| Verify orders persist | Re-fetches each order by ID and confirms the data round-trips correctly. |

## Project structure

```
├── playwright.config.ts        # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # npm scripts and dependencies
│
├── src/
│   ├── config.ts               # Shared BASE_URL and DEFAULT_HEADERS
│   │
│   ├── models/                 # TypeScript interfaces (Pet, Order)
│   │   ├── pet.model.ts
│   │   └── order.model.ts
│   │
│   ├── api/                    # Service layer — one class per API area
│   │   ├── pet.api.ts
│   │   └── store.api.ts
│   │
│   ├── factories/              # Test data generators (Factory pattern)
│   │   ├── pet.factory.ts
│   │   └── order.factory.ts
│   │
│   └── utils/
│       └── retry.ts            # Reusable retry-with-backoff helper
│
└── tests/
    ├── part1-pets.spec.ts      # Exercise Part 1
    └── part2-orders.spec.ts    # Exercise Part 2
```

## Extending the framework

To add new tests:

1. Create a new `.spec.ts` file inside `tests/`.
2. Import the API service classes you need (`PetApi`, `StoreApi`).
3. Use the factories to generate test data.

To add new endpoints:

1. Add the corresponding TypeScript interface in `src/models/` if needed.
2. Add a method to the appropriate API class in `src/api/`.

## Author

**Gabriela Gadda** — Senior QA Automation Engineer
## Tech stack

- [Playwright](https://playwright.dev/) v1.58 — Test runner and HTTP client
- [TypeScript](https://www.typescriptlang.org/) v6 — Static typing
- Node.js — Runtime

