import { NextResponse } from "next/server";
import { createSubscriber } from "@/lib/beehiiv";

type RequestBody = {
  email?: string;
  industry?: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body: RequestBody = await request.json();

    if (!body.email?.trim()) {
      return NextResponse.json({ error: true, message: "Email is required" }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(body.email)) {
      return NextResponse.json({ error: true, message: "Invalid email address" }, { status: 400 });
    }

    const email = body.email.toLowerCase().trim();

    try {
      await createSubscriber({
        email,
        tags: ["lead-magnet:roi-calculator"],
        utm_source: body.utm_source ?? "autocrew-website",
        utm_medium: body.utm_medium ?? "lead-magnet",
        utm_campaign: body.utm_campaign ?? "roi-calculator-2026",
        custom_fields: body.industry
          ? [{ name: "industry", value: body.industry }]
          : undefined,
        automationKey: "roi-calculator",
      });
    } catch (beehiivError) {
      console.error(
        "[ROI Calculator] Beehiiv error:",
        beehiivError instanceof Error ? beehiivError.message : String(beehiivError)
      );
      // Return success anyway — don't block UX on email service issues
    }

    return NextResponse.json(
      { success: true, message: "Your custom ROI report is on its way!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[ROI Calculator] Unexpected error:", error);
    return NextResponse.json(
      { error: true, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
