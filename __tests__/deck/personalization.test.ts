import { describe, it, expect } from "vitest";
import { substitute, formatDate, formatDateShort, type SubstitutionContext } from "@/lib/deck/personalization";

const ctx: SubstitutionContext = {
  prospect: { name: "Acme Corp", industry: "Healthcare", contactName: "Dr. Sarah Chen", dealValue: "$50,000" },
  salesRep: { name: "Jordan", email: "jordan@autocrew-ai.com" },
  date: new Date("2026-04-28T12:00:00Z"),
};

describe("substitute", () => {
  it("replaces whitelisted vars", () => {
    expect(substitute("Hello {{prospect.name}}", ctx)).toBe("Hello Acme Corp");
    expect(substitute("Industry: {{prospect.industry}}", ctx)).toBe("Industry: Healthcare");
    expect(substitute("Contact: {{prospect.contactName}}", ctx)).toBe("Contact: Dr. Sarah Chen");
    expect(substitute("Value: {{prospect.dealValue}}", ctx)).toBe("Value: $50,000");
    expect(substitute("From {{salesRep.name}} <{{salesRep.email}}>", ctx)).toBe("From Jordan <jordan@autocrew-ai.com>");
  });
  it("substitutes date helpers", () => {
    expect(substitute("Sent {{date}}", ctx)).toBe("Sent April 2026");
    expect(substitute("Sent {{date.short}}", ctx)).toBe("Sent 04/2026");
  });
  it("renders missing optional vars as empty string", () => {
    const empty: SubstitutionContext = { prospect: {}, salesRep: {}, date: ctx.date };
    expect(substitute("Hi {{prospect.contactName}}!", empty)).toBe("Hi !");
  });
  it("renders non-whitelisted vars as empty string", () => {
    expect(substitute("Hack: {{prospect.dealValue.somethingNested}}", ctx)).toBe("Hack: ");
    expect(substitute("Bad: {{__proto__}}", ctx)).toBe("Bad: ");
  });
  it("leaves text without vars untouched", () => {
    expect(substitute("Plain text.", ctx)).toBe("Plain text.");
  });
});

describe("date helpers", () => {
  it("formatDate uses 'Month YYYY'", () => {
    expect(formatDate(new Date("2026-04-28"))).toBe("April 2026");
  });
  it("formatDateShort uses 'MM/YYYY'", () => {
    expect(formatDateShort(new Date("2026-04-28"))).toBe("04/2026");
  });
});
