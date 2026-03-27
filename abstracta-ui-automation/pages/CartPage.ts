import { type Page, type Locator } from "@playwright/test";

export interface OrderFormData {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class CartPage {
  readonly page: Page;
  readonly cartBody: Locator;
  readonly cartItems: Locator;
  readonly totalPrice: Locator;
  readonly placeOrderButton: Locator;
  readonly purchaseButton: Locator;
  readonly orderModal: Locator;
  readonly confirmationModal: Locator;

  // Order form fields
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartBody = page.locator("#tbodyid");
    this.cartItems = page.locator("#tbodyid tr");
    this.totalPrice = page.locator("#totalp");
    this.placeOrderButton = page.getByRole("button", {
      name: "Place Order",
    });
    this.orderModal = page.locator("#orderModal");
    this.purchaseButton = this.orderModal.getByRole("button", {
      name: "Purchase",
    });
    this.confirmationModal = page.locator(".sweet-alert");

    this.nameInput = page.locator("#name");
    this.countryInput = page.locator("#country");
    this.cityInput = page.locator("#city");
    this.cardInput = page.locator("#card");
    this.monthInput = page.locator("#month");
    this.yearInput = page.locator("#year");
  }

  async goto() {
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes("/viewcart") && r.status() === 200
    );
    await this.page.goto("/cart.html");
    await responsePromise;
  }

  async waitForCartLoaded() {
    await this.cartBody.waitFor({ state: "attached" });
    await this.cartItems.first().waitFor({ state: "visible" });
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getTotal(): Promise<string> {
    return (await this.totalPrice.textContent()) ?? "0";
  }

  async deleteItem(index: number) {
    const deleteLink = this.cartItems
      .nth(index)
      .getByRole("link", { name: "Delete" });
    await deleteLink.click();
  }

  async placeOrder(data: OrderFormData) {
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: "visible" });

    await this.nameInput.fill(data.name);
    await this.countryInput.fill(data.country);
    await this.cityInput.fill(data.city);
    await this.cardInput.fill(data.card);
    await this.monthInput.fill(data.month);
    await this.yearInput.fill(data.year);

    await this.purchaseButton.click();
  }

  async getConfirmationText(): Promise<string> {
    await this.confirmationModal.waitFor({ state: "visible" });
    return (await this.confirmationModal.textContent()) ?? "";
  }

  async confirmPurchase() {
    await this.confirmationModal
      .getByRole("button", { name: "OK" })
      .click();
  }
}

