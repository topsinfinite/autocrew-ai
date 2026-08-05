import { describe, expect, it } from "vitest";

import {
  findUnknownTokens,
  renderBody,
  renderSubject,
  stripMarkdownToPlain,
} from "@/lib/welcome-sequences/render";
import type { TokenValues } from "@/lib/welcome-sequences/types";

const values: TokenValues = {
  admin_name: "Alex",
  company: "Acme Clinic",
  package_name: "AI Receptionist — Healthcare",
  vertical: "healthcare",
  locations: "2-5",
  go_live: "",
  promised_outcome: "First patient call handled",
  owner_name: "Jordan",
  owner_email: "jordan@autocrew-ai.com",
};

describe("welcome-sequences/render", () => {
  it("falls back empty go_live", () => {
    const { subject } = renderSubject("Go live {{go_live}}", values);
    expect(subject).toContain("your target go-live date (TBD)");
  });

  it("appends friction footer to body", () => {
    const { body, ok } = renderBody("Hello **{{admin_name}}**", values);
    expect(ok).toBe(true);
    expect(body).toContain("Hello Alex");
    expect(body).toContain("Jordan");
    expect(body).toContain("jordan@autocrew-ai.com");
    expect(body).toContain("where you are in setup");
  });

  it("flags unknown tokens", () => {
    expect(findUnknownTokens("Hi {{nope}}")).toEqual(["nope"]);
    const result = renderSubject("Hi {{nope}}", values);
    expect(result.ok).toBe(false);
    expect(result.unknownTokens).toContain("nope");
  });

  it("strips markdown", () => {
    expect(stripMarkdownToPlain("**bold** and `code`")).toBe("bold and code");
  });
});
