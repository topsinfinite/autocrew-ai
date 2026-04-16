import { NextResponse } from "next/server";
import { createSubscriber } from "@/lib/beehiiv";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const email = body.email?.toString().toLowerCase().trim();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 },
      );
    }

    const utmSource = body.utm_source?.toString().trim() || "autocrew-ai";
    const utmMedium = body.utm_medium?.toString().trim() || "signup-form";
    const utmCampaign = body.utm_campaign?.toString().trim() || "launch";

    try {
      await createSubscriber({ email, utmSource, utmMedium, utmCampaign });
    } catch (beehiivError) {
      console.error(
        "Beehiiv subscriber creation failed:",
        beehiivError instanceof Error ? beehiivError.message : beehiivError,
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Unexpected error in newsletter-signup:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
