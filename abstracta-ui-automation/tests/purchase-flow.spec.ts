import { test, expect } from "./fixtures";

test.describe("Purchase Flow", () => {
  test("complete purchase of a product end-to-end", async ({
    homePage,
    productPage,
    cartPage,
    navBar,
  }) => {
    let firstProductName: string;

    await test.step("Browse products and select the first one", async () => {
      await homePage.goto();
      const products = await homePage.getProducts();
      expect(products.length).toBeGreaterThan(0);
      firstProductName = products[0].name;
      await homePage.selectProduct(firstProductName);
    });

    await test.step("Verify product detail and add to cart", async () => {
      await productPage.productName.waitFor({ state: "visible" });
      await expect(productPage.productName).toHaveText(firstProductName);
      await productPage.addToCart();
    });

    await test.step("Navigate to cart and verify product is listed", async () => {
      await navBar.goToCart();
      await cartPage.waitForCartLoaded();
      const itemCount = await cartPage.getItemCount();
      expect(itemCount).toBeGreaterThanOrEqual(1);
    });

    await test.step("Place order with test data", async () => {
      await cartPage.placeOrder({
        name: process.env.TEST_ORDER_NAME ?? "Test User",
        country: process.env.TEST_ORDER_COUNTRY ?? "Argentina",
        city: process.env.TEST_ORDER_CITY ?? "Buenos Aires",
        card: process.env.TEST_ORDER_CARD ?? "1234567890123456",
        month: "03",
        year: "2026",
      });
    });

    await test.step("Verify purchase confirmation", async () => {
      const confirmation = await cartPage.getConfirmationText();
      expect(confirmation).toContain("Thank you for your purchase");
      await cartPage.confirmPurchase();
    });
  });
});

