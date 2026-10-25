import { describe, expect, it } from "vitest";
import { ContactFormSchema, FormDataSchema } from "@/app/(next)/lib/schema";

const valid = {
  name: "Ada",
  email: "ada@example.org",
  title: "Archive",
  message: "Hello there",
};

describe("ContactFormSchema", () => {
  it("accepts a valid submission", () => {
    expect(ContactFormSchema.safeParse(valid).success).toBe(true);
  });
  it.each([
    ["bad email", { email: "nope" }],
    ["short message", { message: "hey" }],
    ["multiline title (header injection)", { title: "a\r\nBcc: x@y.z" }],
    ["filled honeypot", { website: "http://spam" }],
    ["oversized message", { message: "x".repeat(5001) }],
  ])("rejects %s", (_, patch) => {
    expect(ContactFormSchema.safeParse({ ...valid, ...patch }).success).toBe(
      false,
    );
  });
});

describe("FormDataSchema", () => {
  it("requires name, title and a 6+ char message", () => {
    expect(FormDataSchema.safeParse({ name: "", title: "", message: "" }).success).toBe(false);
    expect(FormDataSchema.safeParse({ name: "a", title: "b", message: "123456" }).success).toBe(true);
  });
});
