import { describe, expect, it } from "vitest";
import { clientIp, rateLimited } from "@/app/(next)/lib/rate-limit";
import { internalHref, safeHref } from "@/app/(next)/utils/safeHref";

describe("rateLimited", () => {
  it("blocks past the limit and resets after the window", () => {
    expect(rateLimited("k", 2, 1000, 0)).toBe(false);
    expect(rateLimited("k", 2, 1000, 1)).toBe(false);
    expect(rateLimited("k", 2, 1000, 2)).toBe(true);
    expect(rateLimited("k", 2, 1000, 1001)).toBe(false);
  });
});

describe("clientIp", () => {
  it("uses the last X-Forwarded-For entry, which the proxy appended", () => {
    const h = new Headers({ "x-forwarded-for": "6.6.6.6, 203.0.113.9" });
    expect(clientIp(h)).toBe("203.0.113.9");
  });
  it("falls back to x-real-ip, then unknown", () => {
    expect(clientIp(new Headers({ "x-real-ip": "203.0.113.1" }))).toBe("203.0.113.1");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("safeHref", () => {
  it.each([
    "https://example.org/a",
    "mailto:a@b.fr",
    "tel:+33123456789",
    "/agenda",
    "agenda",
    "#section",
  ])("keeps %s", (url) => expect(safeHref(url)).toBe(url));

  it.each([
    "javascript:alert(1)",
    " JavaScript:alert(1)",
    "java\tscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:x",
  ])("neutralises %j", (url) => expect(safeHref(url)).toBe("#"));

  it("returns an empty string for a missing url", () => {
    expect(safeHref(null)).toBe("");
  });
});

describe("internalHref", () => {
  it.each([
    ["agenda", "/agenda"],
    ["/agenda", "/agenda"],
    ["//evil.com", "/evil.com"],
    ["/\\evil.com", "/evil.com"],
    [null, "/"],
  ])("%j -> %s", (slug, href) => expect(internalHref(slug)).toBe(href));
});

describe("rateLimited housekeeping", () => {
  it("sweeps expired windows and bounds memory", () => {
    for (let i = 0; i < 10_001; i++) rateLimited(`sweep-${i}`, 1, 10, 0);
    // all expired at t=100: the sweep empties the map
    expect(rateLimited("sweep-0", 1, 10, 100)).toBe(false);
    // 10_001 live windows cannot be swept, so the map is cleared instead of growing
    for (let i = 0; i < 10_001; i++) rateLimited(`live-${i}`, 1, 1000, 200);
    expect(rateLimited("live-0", 1, 1000, 201)).toBe(false);
  });
});
