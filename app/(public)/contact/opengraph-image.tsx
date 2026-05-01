import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "Contact Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "Talk to the Autocrew team",
    description:
      "Questions about AI receptionists, customer support, or lead generation? We respond within 24 hours.",
  });
}
