import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt = "About Autocrew";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "About Autocrew",
    description:
      "Our mission is to make AI automation accessible to every business — voice, chat, and lead generation that works 24/7.",
  });
}
