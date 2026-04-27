export type TranscriptTurn = {
  who: "caller" | "sarah";
  text: string;
  /** ms to type the line out (Sarah only). Caller lines render instantly. */
  typeMs?: number;
  /** ms to hold after the line finishes before advancing. */
  holdMs?: number;
};

export const SARAH_TRANSCRIPT: TranscriptTurn[] = [
  {
    who: "caller",
    text: "Hi, I'd like to book a 30-minute consult for next Tuesday afternoon if you have anything.",
    holdMs: 600,
  },
  {
    who: "sarah",
    text: "Sure — Dr. Mensah has 2:15 or 3:45 on Tuesday. Which works better?",
    typeMs: 1900,
    holdMs: 900,
  },
  {
    who: "caller",
    text: "3:45 is great.",
    holdMs: 500,
  },
  {
    who: "sarah",
    text: "Booked. Confirmation text on its way. Anything else before I let you go?",
    typeMs: 2100,
    holdMs: 1400,
  },
];

export type PromptChip = {
  id: string;
  label: string;
  /** What gets sent to AutoCrew.ask. */
  prompt: string;
};

export const PROMPT_CHIPS: PromptChip[] = [
  {
    id: "book",
    label: "Book me an appointment",
    prompt: "Hi Sarah — I'd like to book the next available appointment.",
  },
  {
    id: "hours",
    label: "What are your hours?",
    prompt: "What are your hours and which days are you closed?",
  },
  {
    id: "quote",
    label: "Get a price quote",
    prompt:
      "I'm looking at your service and want to know what it would cost for my situation.",
  },
  {
    id: "callback",
    label: "Have her call me back",
    prompt: "I'd rather get a call back. What do you need from me?",
  },
  {
    id: "escalate",
    label: "Speak to a human",
    prompt: "Can I speak to someone on the team directly?",
  },
];

export const SHIFT_STATS = {
  callsToday: 47,
  avgHandle: "1m 22s",
  booked: 12,
  escalated: 3,
};
