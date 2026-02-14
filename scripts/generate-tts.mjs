/**
 * One-time script to pre-generate TTS audio files from ElevenLabs.
 * Reads ELEVENLABS_API_KEY from .env.local and saves MP3s to public/audio/.
 *
 * Usage: node scripts/generate-tts.mjs
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// Same voice + settings as the original API route
const VOICE_ID = "21m00Tcm4TlvDq8ikWAM"; // Rachel — warm professional

const transcripts = [
  '"I can help you reschedule. Let me pull up your account..."',
  '"Your appointment has been moved to March 20th at 10 AM."',
  '"Is there anything else I can help you with today?"',
  '"I\'ll send a confirmation email to your address on file."',
];

// Read API key from .env.local
function getApiKey() {
  const envPath = resolve(ROOT, ".env.local");
  const envContent = readFileSync(envPath, "utf-8");
  const match = envContent.match(/^ELEVENLABS_API_KEY=(.+)$/m);
  if (!match) {
    throw new Error("ELEVENLABS_API_KEY not found in .env.local");
  }
  return match[1].trim();
}

async function generateAudio(apiKey, text, index) {
  // Strip surrounding quotes (same cleanup as the API route)
  const cleanText = text.replace(/^"|"$/g, "");

  console.log(`[${index + 1}/${transcripts.length}] Generating: "${cleanText.slice(0, 50)}..."`);

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
    throw new Error(`ElevenLabs API error ${response.status}: ${await response.text()}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const outPath = resolve(ROOT, "public", "audio", `tts-${index}.mp3`);
  writeFileSync(outPath, buffer);
  console.log(`  Saved: public/audio/tts-${index}.mp3 (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  const apiKey = getApiKey();
  console.log("Generating TTS audio files...\n");

  for (let i = 0; i < transcripts.length; i++) {
    await generateAudio(apiKey, transcripts[i], i);
  }

  console.log("\nDone! All audio files saved to public/audio/");
}

main().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
