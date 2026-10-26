import { beforeEach, describe, expect, it, vi } from "vitest";

const { send } = vi.hoisted(() => ({ send: vi.fn() }));
let ip = "198.51.100.1";

vi.mock("resend", () => ({
  Resend: class {
    emails = { send };
    constructor(key?: string) {
      if (!key) throw new Error("Missing API key");
    }
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": ip }),
}));

import { sendEmail } from "@/app/(next)/_actions";

const valid = {
  name: "Ada",
  email: "ada@example.org",
  title: "Archive",
  message: "Hello there",
};

let n = 0;
beforeEach(() => {
  // a fresh client address per test keeps the rate limit out of the way
  ip = `198.51.100.${++n}`;
  send.mockReset().mockResolvedValue({ data: { id: "1" } });
  vi.stubEnv("CONTACT_RECIPIENT", "team@example.org");
  vi.stubEnv("RESEND_API_KEY", "re_test");
  vi.spyOn(console, "error").mockImplementation(() => {});
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

describe("sendEmail", () => {
  it("sends to the configured recipient only", async () => {
    const res = await sendEmail(valid);
    expect(res.success).toBe(true);
    expect(send.mock.calls[0][0]).toMatchObject({ to: ["team@example.org"] });
  });

  it("rejects an invalid payload without sending", async () => {
    const res = await sendEmail({ ...valid, email: "nope" });
    expect(res.success).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it("rejects a filled honeypot without sending", async () => {
    const res = await sendEmail({ ...valid, website: "http://spam" });
    expect(res.success).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it("fails closed when CONTACT_RECIPIENT is missing", async () => {
    vi.stubEnv("CONTACT_RECIPIENT", "");
    const res = await sendEmail(valid);
    expect(res.success).toBe(false);
    expect(send).not.toHaveBeenCalled();
  });

  it("answers a clean failure, not an exception, when RESEND_API_KEY is missing", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    await expect(sendEmail(valid)).resolves.toEqual({ success: false });
    expect(send).not.toHaveBeenCalled();
  });

  it("throttles an IP after 5 sends in an hour", async () => {
    for (let i = 0; i < 5; i++) expect((await sendEmail(valid)).success).toBe(true);
    const res = await sendEmail(valid);
    expect(res).toMatchObject({ success: false, rateLimited: true });
    expect(send).toHaveBeenCalledTimes(5);
  });

  it("does not leak the provider error", async () => {
    send.mockRejectedValue(new Error("resend says no"));
    const res = await sendEmail(valid);
    expect(res).toEqual({ success: false });
  });
});
