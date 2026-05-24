import { Resend } from "resend";

import { CustomEmail } from "@/app/(next)/components/ui";

export const dynamic = "force-dynamic";

export async function GET() {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { data, error } = await resend.emails.send({
      from: "<thibaut.randria@gmail.com>",
      to: ["thibaut.randria@gmail.com"],
      subject: "Hello world",
      react: CustomEmail({ firstName: "John" }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json({ data });
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
