import { test, expect } from "./fixtures";

const TEST_PASS = process.env.TEST_PASSWORD ?? "Test1234";

test.describe("Authentication", () => {
  test("signup and then login with the new account", async ({
    page,
    navBar,
  }) => {
    const testUser = `testuser_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    await page.goto("/");

    await test.step("Sign up new user", async () => {
      await navBar.signup(testUser, TEST_PASS);
    });

    await test.step("Log in with new account", async () => {
      await navBar.login(testUser, TEST_PASS);
      await navBar.expectLoggedIn(testUser);
    });

    await test.step("Log out", async () => {
      await navBar.logout();
      await navBar.expectLoggedOut();
    });
  });
});

