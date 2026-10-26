import { expect, test, type Page } from "@playwright/test";

const PAGES = ["/", "/contact", "/agenda", "/blog"];

test.describe("cookie banner", () => {
  test("shows on the first visit and stays closed afterwards", async ({ page }) => {
    await page.goto("/");
    const ok = page.getByRole("button", { name: "Ok", exact: true });
    await expect(ok).toBeVisible();
    await expect(page.getByText(/Speed\s+Insights/)).toBeVisible();

    await ok.click();
    await expect(ok).toBeHidden();

    await page.reload();
    await expect(page.locator("main#main-content")).toBeVisible();
    await expect(ok).toBeHidden();
  });
});

test.describe("rendered links", () => {
  for (const path of PAGES) {
    test(`${path} has no script, data or protocol-relative hrefs`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("main#main-content")).toBeVisible();
      const hrefs = await page
        .locator("a[href]")
        .evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
      expect(hrefs.length).toBeGreaterThan(0);
      for (const href of hrefs) {
        expect(href, href).not.toMatch(/^\s*(javascript|data|vbscript):/i);
        expect(href, href).not.toMatch(/^\/[/\\]/);
      }
    });
  }

  test("external links open in a new tab without opener access", async ({ page }) => {
    await page.goto("/");
    const external = page.locator('a[target="_blank"]');
    for (const a of await external.all()) {
      const rel = (await a.getAttribute("rel")) ?? "";
      expect(rel, await a.getAttribute("href") ?? "").toMatch(/noopener|noreferrer/);
    }
  });
});

test.describe("contact form", () => {
  const fill = async (page: Page) => {
    await page.getByLabel("Nom").fill("Ada");
    await page.getByLabel("Adresse email").fill("ada@example.org");
    await page.getByLabel("Titre de votre archive").fill("Fonds Ada");
    await page.getByPlaceholder("Message").fill("Un message assez long");
  };

  test("empty submit shows field errors and sends nothing", async ({ page }) => {
    const actions: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST" && r.headers()["next-action"]) actions.push(r.url());
    });
    await page.goto("/contact");
    await page.getByRole("button", { name: "Envoyer" }).click();
    await expect(page.getByText("Le nom est requis.")).toBeVisible();
    await expect(page.getByText("Le titre est requis.")).toBeVisible();
    expect(actions).toEqual([]);
  });

  test("a filled honeypot never reaches the server", async ({ page }) => {
    const actions: string[] = [];
    page.on("request", (r) => {
      if (r.method() === "POST" && r.headers()["next-action"]) actions.push(r.url());
    });
    await page.goto("/contact");
    await fill(page);
    // a bot fills the field a human cannot see
    await page.locator('input[name="website"]').evaluate((el: HTMLInputElement) => {
      const set = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value")!.set!;
      set.call(el, "http://spam");
      el.dispatchEvent(new Event("input", { bubbles: true }));
    });
    await page.getByRole("button", { name: "Envoyer" }).click();
    await page.waitForTimeout(1000);
    expect(actions).toEqual([]);
    await expect(page.getByText(/succès/)).toBeHidden();
  });

  test("never reports success when no mail provider is configured, then throttles", async ({ page }) => {
    await page.goto("/contact");
    await fill(page);
    const send = page.getByRole("button", { name: "Envoyer" });

    let throttledAfter = 0;
    for (let i = 1; i <= 6 && !throttledAfter; i++) {
      await Promise.all([
        page.waitForResponse((r) => r.request().headers()["next-action"] !== undefined),
        send.click(),
      ]);
      await expect(page.getByText(/succès/)).toBeHidden();
      await expect(page.getByText(/Trop de demandes|Une erreur s'est produite/).first()).toBeVisible();
      if (await page.getByText("Trop de demandes, réessayez plus tard.").isVisible()) {
        throttledAfter = i;
      }
    }
    expect(throttledAfter, "throttled within 6 valid submissions").toBeGreaterThan(0);
    // the visitor's text is kept so they can retry later
    await expect(page.getByLabel("Nom")).toHaveValue("Ada");
  });
});

test.describe("newsletter", () => {
  test("shows a generic error when Brevo is not configured, then throttles", async ({ page }) => {
    await page.goto("/contact");
    const email = page.getByLabel("email", { exact: true });
    const ok = page.getByRole("button", { name: "OK", exact: true });
    await email.fill("lecteur@example.org");

    let throttledAfter = 0;
    for (let i = 1; i <= 6 && !throttledAfter; i++) {
      await Promise.all([
        page.waitForResponse((r) => r.url().endsWith("/api/newsletter")),
        ok.click(),
      ]);
      await expect(page.getByText(/confirmation/)).toBeHidden();
      if (await page.getByText("Trop de demandes, réessayez plus tard.").isVisible()) {
        throttledAfter = i;
      } else {
        await expect(page.getByText("Une erreur inattendue s'est produite.")).toBeVisible();
      }
    }
    expect(throttledAfter, "throttled within 6 submissions").toBeGreaterThan(0);
    await expect(email).toHaveValue("lecteur@example.org");
  });

  test("an invalid address is rejected by the browser before any request", async ({ page }) => {
    let called = false;
    page.on("request", (r) => {
      if (r.url().endsWith("/api/newsletter")) called = true;
    });
    await page.goto("/contact");
    await page.getByLabel("email", { exact: true }).fill("pas-un-email");
    await page.getByRole("button", { name: "OK", exact: true }).click();
    expect(called).toBe(false);
  });
});

test.describe("draft mode", () => {
  test("/api/draft without a preview secret is refused and sets no cookie", async ({ request }) => {
    const res = await request.get("/api/draft", { maxRedirects: 0 });
    expect(res.status()).toBe(401);
    expect(res.headers()["set-cookie"] ?? "").not.toContain("__prerender_bypass");
  });

  test("published pages never show the draft banner", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Previewing drafts/)).toBeHidden();
  });
});
