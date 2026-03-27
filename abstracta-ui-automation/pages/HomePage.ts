import { type Page, type Locator } from "@playwright/test";

export interface ProductInfo {
  name: string;
  price: string;
  link: string;
}

export class HomePage {
  readonly page: Page;
  readonly productCards: Locator;
  readonly nextButton: Locator;
  readonly previousButton: Locator;
  readonly categoryLinks: Locator;

  private static readonly CATEGORY_LABELS: Record<
    "phone" | "notebook" | "monitor",
    string
  > = {
    phone: "Phones",
    notebook: "Laptops",
    monitor: "Monitors",
  };

  constructor(page: Page) {
    this.page = page;
    this.productCards = page.locator("#tbodyid .card");
    this.nextButton = page.getByRole('button', { name: 'Next' }).last();
    this.previousButton = page.getByRole('button', { name: 'Previous' }).last();
    this.categoryLinks = page.locator('a', { hasText: 'CATEGORIES' });
  }

  async goto() {
    await this.page.goto("/");
  }

  async getProducts(): Promise<ProductInfo[]> {
    await this.productCards.getByRole("link").first().waitFor({ state: "visible" });
    const cards = await this.productCards.all();
    const products: ProductInfo[] = [];
    const baseURL = new URL(this.page.url()).origin;

    for (const card of cards) {
      const nameElem = card.locator(".card-title a");
      const priceElem = card.locator("h5");

      const name = (await nameElem.textContent()) ?? "";
      console.log(`Found product: ${name.trim()}`);
      const price = (await priceElem.textContent()) ?? "";
      const link = (await nameElem.getAttribute("href")) ?? "";

      products.push({
        name: name.trim(),
        price: price.trim(),
        link: link.startsWith("http") ? link : `${baseURL}/${link}`,
      });
    }
    return products;
  }

  async selectProduct(productName: string) {
    await this.productCards
      .locator(".card-title a")
      .filter({ hasText: productName })
      .click();
  }

  // This helper is used to wait for the product list to refresh after an action that triggers a reload (like pagination or category filter)
  private async waitForProductRefresh(action: () => Promise<void>) {
    const currentFirst = await this.productCards
      .first()
      .locator(".card-title a")
      .textContent();
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes("api.demoblaze.com") && r.status() === 200
    );
    await action();         // Perform the action that triggers the product list to refresh
    await responsePromise;  // Wait for the API response that indicates products have been loaded
    await this.page.waitForFunction(
      (oldText: string | null) => {
        const el = document.querySelector("#tbodyid .card .card-title a");
        return el && el.textContent !== oldText;
      },
      currentFirst
    );
  }

  async clickNext() {
    await this.waitForProductRefresh(() => this.nextButton.click());
  }

  async clickPrevious() {
    await this.waitForProductRefresh(() => this.previousButton.click());
  }

  async selectCategory(category: "phone" | "notebook" | "monitor") {
    const label = HomePage.CATEGORY_LABELS[category];
    await this.waitForProductRefresh(() =>
      this.categoryLinks.filter({ hasText: label }).click()
    );
  }
}

