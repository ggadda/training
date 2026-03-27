# 🎭 playwright-e2e-framework

End-to-end test automation for [Demoblaze](https://www.demoblaze.com) — an e-commerce demo store.
Covers the full purchase journey: sign up → browse → add to cart → checkout → confirmation.
Built with the Page Object Model, API-aware waits (no flaky `waitForTimeout`), and typed data contracts throughout.

## Tech Stack

Playwright Test · TypeScript · POM · HTML Reporter

## Project Structure

```
pages/          → Page Objects (HomePage, ProductPage, CartPage, NavBar)
tests/          → Specs (auth, cart, purchase flow, product scraper)
playwright.config.ts
```

## Getting Started

```bash
npm install
npx playwright install --with-deps chromium
npx playwright test            # headless
npm run test:headed            # watch it fly 🚀
npm run report                 # open the HTML report
```

## What the Tests Cover

| Spec | What it does |
|---|---|
| `auth.spec.ts` | Signup → login → verify welcome → logout |
| `cart.spec.ts` | Add product, verify in cart, delete it |
| `purchase-flow.spec.ts` | Full E2E checkout with order confirmation |
| `product-scraper.spec.ts` | Scrapes the catalog and saves to `products.txt` |

## Author

**Gabriela Gadda** — Senior QA Automation Engineer
