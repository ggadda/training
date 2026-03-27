import { type Page, type Locator } from "@playwright/test";

export class ProductPage {
  readonly page: Page;
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productName = page.locator("#tbodyid h2");
    this.productPrice = page.locator("#tbodyid .price-container");
    this.addToCartButton = page.getByRole("link", { name: "Add to cart" });
  }

  async goto(productId: number) {
    await this.page.goto(`/prod.html?idp_=${productId}`);
    await this.productName.waitFor({ state: "visible" });
  }

  async getName(): Promise<string> {
    return (await this.productName.textContent()) ?? "";
  }

  async getPrice(): Promise<string> {
    return (await this.productPrice.textContent()) ?? "";
  }

  async addToCart() {
    const dialogPromise = this.page.waitForEvent("dialog");
    await this.addToCartButton.click();
    const dialog = await dialogPromise;
    await dialog.accept();
  }
}

