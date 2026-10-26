import { afterEach, describe, expect, it, vi } from "vitest";

const { fetchMock, disable } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  disable: vi.fn(),
}));

vi.mock("@/sanity/lib/server-client", () => ({ client: { fetch: fetchMock } }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ disable }) }));

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.resetModules();
});

describe("robots", () => {
  it("allows the site, hides studio and api, points to the sitemap", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://exemple.fr");
    const { default: robots } = await import("@/app/robots");
    const r = robots();
    expect(r.rules[0]).toMatchObject({ userAgent: "*", allow: "/" });
    expect(r.rules[0].disallow).toEqual(
      expect.arrayContaining(["/studio/", "/api/"]),
    );
    expect(r.sitemap).toBe("https://exemple.fr/sitemap.xml");
    expect(r.host).toBe("https://exemple.fr");
  });

  it("defaults to localhost without NEXT_PUBLIC_SITE_URL", async () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    const { default: robots } = await import("@/app/robots");
    expect(robots().sitemap).toBe("http://localhost:3000/sitemap.xml");
  });
});

describe("sitemap", () => {
  it("lists static routes and every Sanity page", async () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://exemple.fr");
    fetchMock.mockResolvedValue([
      { slug: "a-propos", _updatedAt: "2026-01-02T00:00:00Z" },
      { slug: null, _updatedAt: null },
    ]);
    const { default: sitemap } = await import("@/app/(next)/sitemap");
    const urls = (await sitemap()).map((e: { url: string }) => e.url);
    expect(urls).toEqual(
      expect.arrayContaining([
        "https://exemple.fr",
        "https://exemple.fr/agenda",
        "https://exemple.fr/blog",
        "https://exemple.fr/contact",
        "https://exemple.fr/a-propos",
      ]),
    );
    expect(urls).toHaveLength(6);
  });
});

describe("disableDraftMode", () => {
  it("clears the draft cookie after the loading delay", async () => {
    vi.useFakeTimers();
    const { disableDraftMode } = await import("@/app/(next)/actions");
    const done = disableDraftMode();
    await vi.advanceTimersByTimeAsync(1000);
    await done;
    expect(disable).toHaveBeenCalledOnce();
  });
});
