import { beforeEach, describe, expect, it, vi } from "vitest";

const { validatePreviewUrl, enable, redirect } = vi.hoisted(() => ({
  validatePreviewUrl: vi.fn(),
  enable: vi.fn(),
  redirect: vi.fn(),
}));

vi.mock("@sanity/preview-url-secret", () => ({ validatePreviewUrl }));
vi.mock("next/headers", () => ({ draftMode: async () => ({ enable }) }));
vi.mock("next/navigation", () => ({ redirect }));
vi.mock("@/sanity/lib/server-client", () => ({
  client: { withConfig: () => ({}) },
}));
vi.mock("@/sanity/lib/token", () => ({ getToken: () => "token" }));

import { GET } from "@/app/api/draft/route";

beforeEach(() => {
  validatePreviewUrl.mockReset();
  enable.mockReset();
  redirect.mockReset();
});

describe("GET /api/draft", () => {
  it("401 and no draft mode without a valid preview secret", async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: false });
    const res = await GET(new Request("http://localhost/api/draft?secret=x"));
    expect(res.status).toBe(401);
    expect(enable).not.toHaveBeenCalled();
    expect(redirect).not.toHaveBeenCalled();
  });

  it("enables draft mode and redirects when the secret is valid", async () => {
    validatePreviewUrl.mockResolvedValue({ isValid: true, redirectTo: "/agenda" });
    await GET(new Request("http://localhost/api/draft?secret=ok"));
    expect(enable).toHaveBeenCalledOnce();
    expect(redirect).toHaveBeenCalledWith("/agenda");
  });
});
