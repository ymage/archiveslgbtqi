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

test("robots.txt advertises the sitemap", async ({ request }) => {
  const body = await (await request.get("/robots.txt")).text();
  expect(body).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
});

test("pages ship a report-only CSP, the studio does not", async ({ request }) => {
  const page = (await request.get("/robots.txt")).headers();
  const csp = page["content-security-policy-report-only"];
  expect(csp).toContain("frame-ancestors 'self'");
  expect(csp).toContain("object-src 'none'");
  expect(page["content-security-policy"]).toBeUndefined();

  const studio = (await request.get("/studio")).headers();
  expect(studio["content-security-policy-report-only"]).toBeUndefined();
  expect(studio["x-frame-options"]).toBe("SAMEORIGIN");
});

test("contact page renders the form with a hidden honeypot", async ({ page }) => {
  await page.goto("/contact");
  await expect(page.getByLabel("Adresse email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Envoyer" })).toBeVisible();
  await expect(page.locator('input[name="website"]')).toBeHidden();
});
