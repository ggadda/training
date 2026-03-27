import { test, expect } from "./fixtures";
import type { ProductInfo } from "../pages/HomePage";
import * as fs from "fs";
import * as path from "path";

test("scrape products from first 2 pages and save to file", async ({
  homePage,
}, testInfo) => {
  const allProducts: ProductInfo[] = [];

  await test.step("Collect products from page 1", async () => {
    await homePage.goto();
    const page1Products = await homePage.getProducts();
    allProducts.push(...page1Products);
  });

  await test.step("Collect products from page 2", async () => {
    await homePage.clickNext();
    const page2Products = await homePage.getProducts();
    allProducts.push(...page2Products);
  });

  expect(allProducts.length).toBeGreaterThan(0);

  // Build output
  const lines: string[] = [
    "=".repeat(60),
    "DEMOBLAZE PRODUCT CATALOG — First 2 Pages",
    "=".repeat(60),
    "",
  ];

  allProducts.forEach((product, i) => {
    lines.push(`Product #${i + 1}`);
    lines.push(`  Name:  ${product.name}`);
    lines.push(`  Price: ${product.price}`);
    lines.push(`  Link:  ${product.link}`);
    lines.push("");
  });

  lines.push(`Total products: ${allProducts.length}`);

  const outputDir = testInfo.outputDir;
  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "products.txt");
  fs.writeFileSync(outputPath, lines.join("\n"), "utf-8");
  testInfo.attachments.push({
    name: "products.txt",
    contentType: "text/plain",
    path: outputPath,
  });

  console.log(`Saved ${allProducts.length} products to ${outputPath}`);
});

