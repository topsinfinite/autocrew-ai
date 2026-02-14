import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AutoCrew – Agentic Crews Management Platform",
    short_name: "AutoCrew",
    description:
      "Deploy AI crews that automate customer support and lead generation 24/7. No code required.",
    start_url: "/",
    display: "standalone",
    background_color: "#03060e",
    theme_color: "#03060e",
    icons: [
      { src: "/icon", sizes: "48x48", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
