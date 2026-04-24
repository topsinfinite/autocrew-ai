import { describe, it, expect, beforeEach } from "vitest";
import { buildContext, inferSectionLabel } from "../context";

function selectTextIn(el: HTMLElement, text: string): Range {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let node: Node | null;
  while ((node = walker.nextNode())) {
    const content = node.textContent ?? "";
    const idx = content.indexOf(text);
    if (idx >= 0) {
      const range = document.createRange();
      range.setStart(node, idx);
      range.setEnd(node, idx + text.length);
      return range;
    }
  }
  throw new Error(`Text "${text}" not found in element`);
}

describe("buildContext", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    window.history.replaceState({}, "", "/pricing?utm=abc#plans");
  });

  it("captures surrounding paragraph text for a <p> ancestor", () => {
    document.body.innerHTML = `
      <section>
        <h2>Pricing</h2>
        <p>Professional is $99 per month with HIPAA compliance.</p>
      </section>
    `;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "HIPAA compliance");
    const ctx = buildContext(range, "HIPAA compliance");
    expect(ctx.selection).toBe("HIPAA compliance");
    expect(ctx.surrounding).toBe("Professional is $99 per month with HIPAA compliance.");
    expect(ctx.sectionLabel).toBe("Pricing");
    expect(ctx.url).toBe("/pricing");
  });

  it("caps surrounding text at 500 chars", () => {
    const longText = "a".repeat(700);
    document.body.innerHTML = `<section><h1>H</h1><p>${longText}</p></section>`;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "a".repeat(20));
    const ctx = buildContext(range, "a".repeat(20));
    expect(ctx.surrounding?.length).toBe(500);
  });

  it("collapses whitespace in surrounding text", () => {
    document.body.innerHTML = `<section><h1>H</h1><p>foo   bar\n\tbaz qux</p></section>`;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "bar");
    const ctx = buildContext(range, "bar");
    expect(ctx.surrounding).toBe("foo bar baz qux");
  });

  it("handles selection with no block ancestor by leaving surrounding undefined", () => {
    document.body.innerHTML = `<div><span>raw text with enough chars here</span></div>`;
    const span = document.querySelector("span")!;
    const range = selectTextIn(span, "raw text");
    const ctx = buildContext(range, "raw text");
    expect(ctx.surrounding).toBeUndefined();
    expect(ctx.sectionLabel).toBeUndefined();
  });

  it("respects [data-section] as a boundary and label source", () => {
    document.body.innerHTML = `
      <div data-section="Hero">
        <h1>Marketing headline</h1>
        <p>A compelling claim about conversion.</p>
      </div>
    `;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "compelling claim");
    const ctx = buildContext(range, "compelling claim");
    expect(ctx.sectionLabel).toBe("Hero");
  });

  it("falls back to heading text when no [data-section]", () => {
    document.body.innerHTML = `
      <section>
        <h2>Our features</h2>
        <p>Self-serve onboarding reduces support tickets.</p>
      </section>
    `;
    const p = document.querySelector("p")!;
    const range = selectTextIn(p, "Self-serve");
    const ctx = buildContext(range, "Self-serve");
    expect(ctx.sectionLabel).toBe("Our features");
  });

  it("url strips search and hash", () => {
    window.history.replaceState({}, "", "/about?ref=linkedin#team");
    document.body.innerHTML = `<section><h1>H</h1><p>hello world text here</p></section>`;
    const range = selectTextIn(document.querySelector("p")!, "hello world");
    const ctx = buildContext(range, "hello world");
    expect(ctx.url).toBe("/about");
  });
});

describe("inferSectionLabel", () => {
  it("returns undefined for null boundary", () => {
    expect(inferSectionLabel(null)).toBeUndefined();
  });

  it("prefers explicit data-section over heading", () => {
    const el = document.createElement("section");
    el.setAttribute("data-section", "Explicit");
    el.innerHTML = `<h1>Heading</h1>`;
    expect(inferSectionLabel(el)).toBe("Explicit");
  });

  it("falls back to first h1/h2/h3 text", () => {
    const el = document.createElement("section");
    el.innerHTML = `<h3>Third heading wins</h3>`;
    expect(inferSectionLabel(el)).toBe("Third heading wins");
  });

  it("truncates heading text at 80 chars", () => {
    const el = document.createElement("section");
    el.innerHTML = `<h1>${"x".repeat(120)}</h1>`;
    expect(inferSectionLabel(el)?.length).toBe(80);
  });

  it("falls back to aria-label, then id", () => {
    const withAria = document.createElement("section");
    withAria.setAttribute("aria-label", "Pricing region");
    expect(inferSectionLabel(withAria)).toBe("Pricing region");

    const withId = document.createElement("section");
    withId.id = "faq";
    expect(inferSectionLabel(withId)).toBe("faq");
  });

  it("returns undefined when boundary has no label, heading, aria-label, or id", () => {
    const bare = document.createElement("section");
    expect(inferSectionLabel(bare)).toBeUndefined();
  });
});
