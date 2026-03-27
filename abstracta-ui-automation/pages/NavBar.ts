import { type Page, type Locator, expect } from "@playwright/test";

export class NavBar {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly cartLink: Locator;
  readonly homeLink: Locator;
  readonly logoutLink: Locator;
  readonly welcomeUser: Locator;

  // Login modal
  readonly loginModal: Locator;
  readonly loginUsername: Locator;
  readonly loginPassword: Locator;
  readonly loginButton: Locator;

  // Signup modal
  readonly signupModal: Locator;
  readonly signupUsername: Locator;
  readonly signupPassword: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByRole('link', { name: 'Log in' });
    this.signupLink = page.getByRole('link', { name: 'Sign up' });
    this.cartLink = page.locator("#cartur");
    this.homeLink = page.getByRole("link", { name: "Home" });
    this.logoutLink = page.locator("#logout2");
    this.welcomeUser = page.locator("#nameofuser");
    this.loginModal = page.locator("#logInModal");
    this.loginUsername = page.locator("#loginusername");
    this.loginPassword = page.locator("#loginpassword");
    this.loginButton = this.loginModal.getByRole("button", { name: "Log in" });

    this.signupModal = page.locator("#signInModal");
    this.signupUsername = page.locator("#sign-username");
    this.signupPassword = page.locator("#sign-password");
    this.signupButton = this.signupModal.getByRole("button", {
      name: "Sign up",
    });
  }

  async login(username: string, password: string) {
    await this.loginLink.click();
    await this.loginUsername.isVisible();
    await this.loginUsername.fill(username);
    await this.loginPassword.fill(password);
    await this.loginButton.click();
    await this.welcomeUser.isVisible
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.welcomeUser.isVisible();
  }

  async signup(username: string, password: string) {
    const dialogPromise = this.page.waitForEvent("dialog");
    await this.signupLink.click();
    await this.signupUsername.waitFor({ state: "visible" });
    await this.signupUsername.fill(username);
    await this.signupPassword.fill(password);
    await this.signupButton.click();
    const dialog = await dialogPromise;
    await dialog.accept();
    // Wait for the signup modal to close as confirmation
    await this.signupModal.waitFor({ state: "hidden" });
  }

  async logout() {
    await this.logoutLink.click();
    await expect(this.loginLink).toBeVisible();
  }

  async goToCart() {
    const responsePromise = this.page.waitForResponse(
      (r) => r.url().includes("/viewcart") && r.status() === 200
    );
    await this.cartLink.click();
    await responsePromise;
  }

  async expectLoggedIn(username: string) {
    await expect(this.welcomeUser).toContainText(`Welcome ${username}`);
  }

  async expectLoggedOut() {
    await expect(this.loginLink).toBeVisible();
  }
}

