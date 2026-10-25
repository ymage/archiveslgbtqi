import { expect, test } from "@playwright/test";

test("robots.txt blocks studio and api", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toContain("Disallow: /studio/");
  expect(body).toContain("Disallow: /api/");
});

test("security headers are set", async ({ request }) => {
  const h = (await request.get("/robots.txt")).headers();
  expect(h["x-content-type-options"]).toBe("nosniff");
  expect(h["x-frame-options"]).toBe("SAMEORIGIN");
});

test("home renders without console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const res = await page.goto("/");
  expect(res?.status()).toBe(200);
  await expect(page.locator("main#main-content")).toBeVisible();
  expect(errors).toEqual([]);
});

test("unknown route shows 404", async ({ page }) => {
  const res = await page.goto("/cette-page-nexiste-pas");
  expect(res?.status()).toBe(404);
});

test("newsletter rejects invalid email", async ({ request }) => {
  const res = await request.post("/api/newsletter", { data: { email: "nope" } });
  expect(res.status()).toBe(400);
});
