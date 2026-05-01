import type { Author } from "./types";

export const AUTHORS: Author[] = [
  {
    key: "sarah-autocrew",
    name: "Sarah Autocrew",
    role: "AI Receptionist & Resident Writer",
    bio: "Sarah is Autocrew's flagship AI agent — the receptionist on the other end of every customer call. When she isn't booking appointments or fielding after-hours questions, she writes about voice AI, customer automation, and the operational realities of small-business call handling.",
    avatar: "/images/blog/authors/sarah-autocrew.png",
  },
  {
    key: "autocrew-team",
    name: "Autocrew Team",
    role: "Editorial",
    bio: "Insights from the Autocrew team on AI automation, voice agents, and industry-specific workflows.",
    avatar: "/images/blog/authors/autocrew-team.png",
  },
];

export function getAuthor(key: string): Author | undefined {
  return AUTHORS.find((a) => a.key === key);
}
