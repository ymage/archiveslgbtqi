import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const EmailSchema = z.string().email({ message: "Adresse email non valide." });

async function sendWelcomeEmail(
  email: string,
  apiKey: string,
  templateId: number,
) {
  const url = `https://api.brevo.com/v3/smtp/email`;
  const data = {
    to: [{ email }],
    templateId,
  };

  const options = {
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
  };

  try {
    const response = await axios.post(url, data, options);
    if (response.status === 201) {
      return true;
    } else {
      console.error(
        "Unexpected response status from Brevo API:",
        response.status,
      );
      return false;
    }
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
}

async function newSubscriberHandler(email: string) {
  const API_KEY = process.env.BREVO_API_KEY;
  const TEMPLATE_ID = parseInt(
    process.env.BREVO_WELCOME_EMAIL_TEMPLATE_ID || "0",
    10,
  );

  if (!API_KEY) {
    console.error("BREVO_API_KEY is not set");
    return false;
  }

  if (TEMPLATE_ID === 0) {
    console.warn(
      "BREVO_WELCOME_EMAIL_TEMPLATE_ID is not set. Skipping welcome email.",
    );
    return true; // Skipping but returning true as the subscription was successful
  }

  const emailSent = await sendWelcomeEmail(email, API_KEY, TEMPLATE_ID);

  if (emailSent) {
    console.log("Welcome email sent successfully!");
    return true;
  } else {
    console.error("Failed to send welcome email");
    return false;
  }
}

export async function POST(req: NextRequest) {
  if (req.method !== "POST") {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await req.json();
    const emailValidation = EmailSchema.safeParse(body.email);
    if (!emailValidation.success) {
      return NextResponse.json(
        { error: "Adresse email non valide." },
        { status: 400 },
      );
    }

    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const LIST_ID = parseInt(process.env.BREVO_LIST_ID || "", 10) || 0; // Get your List ID from Brevo!

    if (!BREVO_API_KEY || !LIST_ID) {
      console.error("Brevo API Key or List ID not configured properly");
      return NextResponse.json(
        { error: "Une erreur inattendue s'est produite." },
        { status: 500 },
      );
    }

    const url = "https://api.brevo.com/v3/contacts";
    const data = {
      email: emailValidation.data, // Use the validated email
      listIds: [LIST_ID],
      updateEnabled: true, // Update the contact if it already exists
    };

    const options = {
      headers: {
        "Content-Type": "application/json",
        "api-key": BREVO_API_KEY,
      },
    };

    const response = await axios.post(url, data, options);

    if (response.status === 201) {
      await newSubscriberHandler(emailValidation.data);
      return NextResponse.json(
        { message: "Merci pour votre inscription." },
        { status: 201 },
      );
    } else if (response.status === 204) {
      return NextResponse.json(
        { message: "Vous êtes déjà abonné." },
        { status: 200 },
      );
    } else {
      console.error("Brevo API Error:", response.status, response.data);
      return NextResponse.json(
        { error: "Une erreur inattendue s'est produite." },
        { status: response.status || 500 },
      );
    }
  } catch (error) {
    console.error("Error subscribing to Brevo:", error);
    return NextResponse.json(
      { error: "Une erreur inattendue s'est produite." },
      { status: 500 },
    );
  }
}
