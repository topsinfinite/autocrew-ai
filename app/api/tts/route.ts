import { NextRequest, NextResponse } from "next/server";

const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — warm professional

export async function POST(request: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ElevenLabs API key not configured" },
      { status: 500 },
    );
  }

  let text: string;
  try {
    const body = await request.json();
    text = body.text;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  // Strip surrounding quotes from transcript strings
  const cleanText = text.replace(/^"|"$/g, "");

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          Accept: "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": apiKey,
        },
        body: JSON.stringify({
          text: cleanText,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.8,
          },
        }),
      },
    );

    if (!response.ok) {
      console.error("ElevenLabs API error:", response.status);
      return NextResponse.json(
        { error: "Failed to generate speech" },
        { status: response.status },
      );
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("TTS API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
