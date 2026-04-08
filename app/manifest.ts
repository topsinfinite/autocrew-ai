import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Autocrew – Agentic Crews Management Platform",
    short_name: "Autocrew",
    description:
      "Deploy AI crews that automate customer support and lead generation 24/7. No code required.",
    start_url: "/",
    display: "standalone",
    background_color: "#03060e",
    theme_color: "#03060e",
    icons: [
      { src: "/icon.png", sizes: "48x48", type: "image/png" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
