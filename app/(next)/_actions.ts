"use server";

import { headers } from "next/headers";
import { createElement } from "react";
import { z } from "zod";
import { Resend } from "resend";

import ContactFormEmail from "./emails/contact-form-email";
import { clientIp, rateLimited } from "./lib/rate-limit";
import { ContactFormSchema } from "./lib/schema";

type ContactFormInputs = z.infer<typeof ContactFormSchema>;
const HOUR = 60 * 60 * 1000;
const PER_IP_LIMIT = 5;
const GLOBAL_LIMIT = 100;

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);
  if (!result.success) {
    return { success: false, error: result.error.format() };
  }

  const ip = clientIp(await headers());
  if (
    rateLimited(`contact:${ip}`, PER_IP_LIMIT, HOUR) ||
    rateLimited("contact:*", GLOBAL_LIMIT, HOUR)
  ) {
    return { success: false, rateLimited: true };
  }

  const to = process.env.CONTACT_RECIPIENT;
  if (!to) {
    console.error("CONTACT_RECIPIENT is not set");
    return { success: false };
  }

  const { name, email, title, message } = result.data;

  try {
    // built here, not at module load: `new Resend()` throws without a key and would 500 every call
    const resend = new Resend(process.env.RESEND_API_KEY);
    const data = await resend.emails.send({
      from: "Archives LGBTQI <recensement@archiveslgbtqi.fr>",
      to: [to],
      subject: `Proposition d'archive: ${title}`,
      text: `Nom: ${name}\nAdresse mail: ${email}\nMessage: ${message} `,
      react: createElement(ContactFormEmail, { name, email, message, title }),
    });
    return { success: true, data };
  } catch (error) {
    console.error("sendEmail failed:", error);
    return { success: false };
  }
}
