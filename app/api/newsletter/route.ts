import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

import { clientIp, rateLimited } from "@/app/(next)/lib/rate-limit";

const EmailSchema = z.string().email({ message: "Adresse email non valide." });

const HOUR = 60 * 60 * 1000;
const PER_IP_LIMIT = 5;
const GLOBAL_LIMIT = 200;

const unexpected = (status = 500) =>
  NextResponse.json(
    { error: "Une erreur inattendue s'est produite." },
    { status },
  );

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const emailValidation = EmailSchema.safeParse(body.email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: "Adresse email non valide." },
        { status: 400 },
      );
    }

    const ip = clientIp(req.headers);
    if (
      rateLimited(`newsletter:${ip}`, PER_IP_LIMIT, HOUR) ||
      rateLimited("newsletter:*", GLOBAL_LIMIT, HOUR)
    ) {
      return NextResponse.json(
        { error: "Trop de demandes, réessayez plus tard." },
        { status: 429 },
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const LIST_ID = parseInt(process.env.BREVO_LIST_ID || "", 10) || 0;
    const TEMPLATE_ID =
      parseInt(process.env.BREVO_DOI_TEMPLATE_ID || "", 10) || 0;
    const REDIRECT_URL = process.env.BREVO_DOI_REDIRECT_URL;

    if (!BREVO_API_KEY || !LIST_ID || !TEMPLATE_ID || !REDIRECT_URL) {
      console.error("Brevo double opt-in is not configured properly");
      return unexpected();
    }

    // Double opt-in: Brevo only adds the contact to the list once the owner clicks the confirmation link.
    const response = await axios.post(
      "https://api.brevo.com/v3/contacts/doubleOptinConfirmation",
      {
        email: emailValidation.data,
        includeListIds: [LIST_ID],
        templateId: TEMPLATE_ID,
        redirectionUrl: REDIRECT_URL,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": BREVO_API_KEY,
        },
      },
    );

    if (response.status === 201 || response.status === 204) {
      // Same answer whether or not the address is already subscribed, so the route is not an oracle.
      return NextResponse.json(
        {
          message:
            "Merci ! Si cette adresse est valide, un e-mail de confirmation vient de vous être envoyé.",
        },
        { status: 202 },
      );
    }

    console.error("Brevo API Error:", response.status, response.data);
    return unexpected();
  } catch (error) {
    console.error("Error subscribing to Brevo:", error);
    return unexpected();
  }
}
