import { test as base } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductPage } from "../pages/ProductPage";
import { CartPage } from "../pages/CartPage";
import { NavBar } from "../pages/NavBar";

type AppFixtures = {
  homePage: HomePage;
  productPage: ProductPage;
  cartPage: CartPage;
  navBar: NavBar;
};

export const test = base.extend<AppFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  navBar: async ({ page }, use) => {
    await use(new NavBar(page));
  },
});

export { expect } from "@playwright/test";

