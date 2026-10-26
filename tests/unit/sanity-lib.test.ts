import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { fetchMock, draftEnabled } = vi.hoisted(() => ({
  fetchMock: vi.fn(),
  draftEnabled: { value: false },
}));

vi.mock("server-only", () => ({}));
vi.mock("react", async (orig) => ({
  ...(await orig<typeof import("react")>()),
  experimental_taintUniqueValue: vi.fn(),
}));
vi.mock("next/headers", () => ({
  draftMode: async () => ({ isEnabled: draftEnabled.value }),
}));
vi.mock("@/sanity/lib/server-client", () => ({ client: { fetch: fetchMock } }));
vi.mock("@/sanity/lib/token", () => ({ getToken: () => "read-token" }));

import { sanityFetch } from "@/sanity/lib/fetch";

const transient = (code: string) => Object.assign(new Error(code), { code });

beforeEach(() => {
  fetchMock.mockReset().mockResolvedValue({ ok: true });
  draftEnabled.value = false;
});
afterEach(() => vi.useRealTimers());

describe("sanityFetch", () => {
  it("reads the published perspective from the CDN without a token", async () => {
    await sanityFetch({ query: "*", params: { slug: "a" } });
    const [query, params, options] = fetchMock.mock.calls[0];
    expect(query).toBe("*");
    expect(params).toEqual({ slug: "a" });
    expect(options).toMatchObject({ perspective: "published", useCdn: true });
    expect(options.token).toBeUndefined();
  });

  it("uses the token and previewDrafts only when draft mode is on", async () => {
    draftEnabled.value = true;
    await sanityFetch({ query: "*" });
    expect(fetchMock.mock.calls[0][2]).toMatchObject({
      perspective: "previewDrafts",
      token: "read-token",
      useCdn: false,
      stega: true,
    });
  });

  it("an explicit published perspective ignores draft mode", async () => {
    draftEnabled.value = true;
    await sanityFetch({ query: "*", perspective: "published", stega: false });
    const options = fetchMock.mock.calls[0][2];
    expect(options.perspective).toBe("published");
    expect(options.token).toBeUndefined();
  });

  it("retries transient network errors with backoff, then succeeds", async () => {
    vi.useFakeTimers();
    fetchMock
      .mockRejectedValueOnce(transient("ECONNRESET"))
      .mockRejectedValueOnce(transient("ETIMEDOUT"))
      .mockResolvedValueOnce({ ok: true });
    const result = sanityFetch({ query: "*" });
    await vi.advanceTimersByTimeAsync(500 + 1000);
    await expect(result).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("recognises a transient code on error.cause", async () => {
    vi.useFakeTimers();
    fetchMock
      .mockRejectedValueOnce(new Error("fetch failed", { cause: transient("EAI_AGAIN") }))
      .mockResolvedValueOnce({ ok: true });
    const result = sanityFetch({ query: "*" });
    await vi.advanceTimersByTimeAsync(500);
    await expect(result).resolves.toEqual({ ok: true });
  });

  it("gives up after 3 retries", async () => {
    vi.useFakeTimers();
    fetchMock.mockRejectedValue(transient("ECONNREFUSED"));
    const result = sanityFetch({ query: "*" });
    const assertion = expect(result).rejects.toThrow("ECONNREFUSED");
    await vi.advanceTimersByTimeAsync(500 + 1000 + 2000);
    await assertion;
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it("does not retry other errors", async () => {
    fetchMock.mockRejectedValue(new Error("bad query"));
    await expect(sanityFetch({ query: "*" })).rejects.toThrow("bad query");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});

describe("sanity/lib/token", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("returns the token and taints it", async () => {
    vi.resetModules();
    vi.doUnmock("@/sanity/lib/token");
    vi.stubEnv("SANITY_API_READ_TOKEN", "abc");
    const { getToken } = await import("@/sanity/lib/token");
    const { experimental_taintUniqueValue } = await import("react");
    expect(getToken()).toBe("abc");
    expect(experimental_taintUniqueValue).toHaveBeenCalledWith(
      expect.any(String),
      process,
      "abc",
    );
  });

  it("throws when the token is missing", async () => {
    vi.resetModules();
    vi.doUnmock("@/sanity/lib/token");
    vi.stubEnv("SANITY_API_READ_TOKEN", "");
    const { getToken } = await import("@/sanity/lib/token");
    expect(getToken).toThrow(/SANITY_API_READ_TOKEN/);
  });
});

describe("sanity/lib/api", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("requires the project id and dataset", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "");
    // empty string is defined, so the assertion passes; unset it for real
    delete process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
    await expect(import("@/sanity/lib/api")).rejects.toThrow(/PROJECT_ID/);
  });

  it("falls back to the default API version", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "p");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "d");
    delete process.env.NEXT_PUBLIC_SANITY_API_VERSION;
    const api = await import("@/sanity/lib/api");
    expect(api.apiVersion).toBe("2024-02-28");
    expect(api.studioUrl).toBe("/studio");
  });
});

describe("sanity/lib/utils", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SANITY_PROJECT_ID", "proj");
    vi.stubEnv("NEXT_PUBLIC_SANITY_DATASET", "data");
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  const image = { asset: { _ref: "image-abc123-1200x800-jpg" }, alt: "Alt" };

  it("urlForImage ignores images without an asset reference", async () => {
    const { urlForImage } = await import("@/sanity/lib/utils");
    expect(urlForImage({})).toBeUndefined();
    expect(urlForImage(null)).toBeUndefined();
  });

  it("urlForImage builds a cdn.sanity.io url for the configured project", async () => {
    const { urlForImage } = await import("@/sanity/lib/utils");
    expect(urlForImage(image)?.url()).toMatch(
      /^https:\/\/cdn\.sanity\.io\/images\/proj\/data\/abc123-1200x800\.jpg/,
    );
  });

  it("resolveOpenGraphImage returns a cropped 1200x627 image with its alt text", async () => {
    const { resolveOpenGraphImage } = await import("@/sanity/lib/utils");
    const og = resolveOpenGraphImage(image);
    expect(og).toMatchObject({ alt: "Alt", width: 1200, height: 627 });
    expect(og?.url).toContain("w=1200");
    expect(og?.url).toContain("h=627");
    expect(resolveOpenGraphImage(undefined)).toBeUndefined();
    expect(resolveOpenGraphImage({})).toBeUndefined();
  });
});
