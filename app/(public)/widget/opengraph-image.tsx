import {
  renderOgImage,
  ogImageSize,
  ogImageContentType,
} from "@/lib/seo/og-image";

export const runtime = "edge";
export const alt =
  "AutoCrew Widget — Turn every button into a live conversation";
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return renderOgImage({
    title: "Turn every button into a live conversation",
    description:
      "Five trigger surfaces. Zero forms. Embed AutoCrew on any site and let visitors reach your AI crew from any page, button, or link.",
  });
}
