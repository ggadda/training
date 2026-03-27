import { test, expect } from "./fixtures";

test.describe("Cart Management", () => {
  test("add a product to the cart and verify it appears", async ({
    homePage,
    productPage,
    cartPage,
    navBar,
  }) => {
    await test.step("Navigate to a product and add it to cart", async () => {
      await homePage.goto();
      const products = await homePage.getProducts();
      const targetProduct = products[0];

      await homePage.selectProduct(targetProduct.name);
      await productPage.productName.waitFor({ state: "visible" });
      await productPage.addToCart();

      await test.step("Verify product appears in cart", async () => {
        await navBar.goToCart();
        await cartPage.waitForCartLoaded();
        await expect(cartPage.cartBody).toContainText(targetProduct.name);
      });

      await test.step("Delete item and verify removal", async () => {
        await cartPage.deleteItem(0);
        await expect(cartPage.cartBody).not.toContainText(targetProduct.name);
      });
    });
  });
});

