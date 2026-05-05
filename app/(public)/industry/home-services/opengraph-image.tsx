import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "AI Receptionist for Home Services — Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "AI Receptionist for HVAC, Plumbing & Electrical",
    description:
      "24/7 call coverage, emergency triage, and live dispatch into ServiceTitan, Housecall Pro, Jobber, and Workiz.",
  });
}
