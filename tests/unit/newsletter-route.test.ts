import axios from "axios";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/newsletter/route";

vi.mock("axios");

let ip = 0;
const req = (body: unknown) =>
  new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    // a fresh address per request keeps the per-IP rate limit out of the way
    headers: { "x-forwarded-for": `10.0.0.${++ip}` },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.stubEnv("BREVO_API_KEY", "key");
  vi.stubEnv("BREVO_LIST_ID", "7");
  vi.stubEnv("BREVO_DOI_TEMPLATE_ID", "3");
  vi.stubEnv("BREVO_DOI_REDIRECT_URL", "https://example.org/merci");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("POST /api/newsletter", () => {
  it("400 on invalid email without calling Brevo", async () => {
    const res = await POST(req({ email: "nope" }));
    expect(res.status).toBe(400);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it.each(["BREVO_API_KEY", "BREVO_LIST_ID", "BREVO_DOI_TEMPLATE_ID", "BREVO_DOI_REDIRECT_URL"])(
    "500 when %s is missing",
    async (name) => {
      vi.stubEnv(name, "");
      const res = await POST(req({ email: "a@b.fr" }));
      expect(res.status).toBe(500);
      expect(axios.post).not.toHaveBeenCalled();
    },
  );

  it("requests a double opt-in confirmation, never a direct contact upsert", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 201 });
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(202);
    const [url, payload] = vi.mocked(axios.post).mock.calls[0];
    expect(url).toBe("https://api.brevo.com/v3/contacts/doubleOptinConfirmation");
    expect(payload).toEqual({
      email: "a@b.fr",
      includeListIds: [7],
      templateId: 3,
      redirectionUrl: "https://example.org/merci",
    });
    expect(axios.post).toHaveBeenCalledTimes(1);
  });

  it("answers the same for an already subscribed address", async () => {
    vi.mocked(axios.post).mockResolvedValueOnce({ status: 201 });
    const created = await POST(req({ email: "a@b.fr" }));
    vi.mocked(axios.post).mockResolvedValueOnce({ status: 204 });
    const existing = await POST(req({ email: "a@b.fr" }));
    expect(existing.status).toBe(created.status);
    expect(await existing.json()).toEqual(await created.json());
  });

  it("500 when Brevo throws", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("boom"));
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(500);
  });

  it("429 once an IP exceeds its hourly limit", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 201 });
    const same = () =>
      new NextRequest("http://localhost/api/newsletter", {
        method: "POST",
        headers: { "x-forwarded-for": "192.0.2.1" },
        body: JSON.stringify({ email: "a@b.fr" }),
      });
    for (let i = 0; i < 5; i++) expect((await POST(same())).status).toBe(202);
    expect((await POST(same())).status).toBe(429);
  });
});

describe("POST /api/newsletter, unexpected Brevo answers", () => {
  it("500 when Brevo answers with an unexpected 2xx status", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 200, data: {} });
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(500);
  });

  it("500 on a malformed body", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/newsletter", { method: "POST", body: "{nope" }),
    );
    expect(res.status).toBe(500);
  });
});
