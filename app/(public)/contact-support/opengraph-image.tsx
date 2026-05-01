import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "Contact Autocrew Support";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "Autocrew Support",
    description:
      "Email, phone, and access-request channels for existing customers and new organization members.",
  });
}
