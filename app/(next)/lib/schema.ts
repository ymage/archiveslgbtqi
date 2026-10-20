import { z } from "zod";

export const FormDataSchema = z.object({
  name: z.string().nonempty("Name is required."),
  title: z.string().nonempty("Title is required."),
  message: z
    .string()
    .nonempty("Message is required.")
    .min(6, { message: "Message must be at least 6 characters." }),
});

export const ContactFormSchema = z.object({
  name: z.string().nonempty("Name is required.").max(100),
  email: z
    .string()
    .nonempty("Email is required.")
    .email("Invalid email.")
    .max(254),
  title: z
    .string()
    .nonempty("Title is required.")
    .max(150)
    .regex(/^[^\r\n]*$/, "Invalid title."),
  message: z
    .string()
    .nonempty("Message is required.")
    .min(6, { message: "Message must be at least 6 characters." })
    .max(5000),
  // Honeypot: hidden in the form, bots fill it.
  website: z.string().max(0).optional(),
});
