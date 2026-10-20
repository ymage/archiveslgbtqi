"use server";

import { z } from "zod";
import { Resend } from "resend";

import ContactFormEmail from "./emails/contact-form-email";
import { ContactFormSchema, FormDataSchema } from "./lib/schema";

type Inputs = z.infer<typeof FormDataSchema>;

export async function addEntry(data: Inputs) {
  const result = FormDataSchema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}

type ContactFormInputs = z.infer<typeof ContactFormSchema>;
const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(data: ContactFormInputs) {
  const result = ContactFormSchema.safeParse(data);

  if (result.success) {
    const { name, email, title, message } = result.data;

    try {
      const data = await resend.emails.send({
        from: "<rencensement@archiveslgbtqi.fr>",
        to: ["thibaut.randria@gmail.com"],
        subject: `Proposition d'archive: ${title}`,
        text: `Nom: ${name}\nAdresse mail: ${email}\nMessage: ${message} `,
        react: ContactFormEmail({ name, email, message, title }),
      });
      return { success: true, data };
    } catch (error) {
      console.error("sendEmail failed:", error);
      return { success: false };
    }
  }

  if (result.error) {
    return { success: false, error: result.error.format() };
  }
}
