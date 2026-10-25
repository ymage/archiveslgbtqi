import axios from "axios";
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/newsletter/route";

vi.mock("axios");

const req = (body: unknown) =>
  new NextRequest("http://localhost/api/newsletter", {
    method: "POST",
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.stubEnv("BREVO_API_KEY", "key");
  vi.stubEnv("BREVO_LIST_ID", "7");
  vi.stubEnv("BREVO_WELCOME_EMAIL_TEMPLATE_ID", "");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("POST /api/newsletter", () => {
  it("400 on invalid email without calling Brevo", async () => {
    const res = await POST(req({ email: "nope" }));
    expect(res.status).toBe(400);
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("500 when Brevo is not configured", async () => {
    vi.stubEnv("BREVO_API_KEY", "");
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(500);
  });

  it("201 on new subscriber, sending the list id", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 201 });
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(201);
    expect(vi.mocked(axios.post).mock.calls[0][1]).toMatchObject({
      email: "a@b.fr",
      listIds: [7],
    });
  });

  it("200 'already subscribed' on 204", async () => {
    vi.mocked(axios.post).mockResolvedValue({ status: 204 });
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(200);
    expect((await res.json()).message).toMatch(/déjà/);
  });

  it("500 when Brevo throws", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("boom"));
    const res = await POST(req({ email: "a@b.fr" }));
    expect(res.status).toBe(500);
  });
});
