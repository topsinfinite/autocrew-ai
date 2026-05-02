# Brief: How to Write an AI Receptionist Prompt (Without Sounding Like a Bot)

**Slug:** how-to-write-ai-receptionist-prompt
**Status:** Brief (promoted from backlog in editorial calendar)
**Target publish:** 2026-07-24 (Week 6 of 90-day plan)
**Primary keyword:** how to write ai receptionist prompt
**Secondary keywords:** ai receptionist script template, ai voice agent prompt examples, virtual receptionist greeting script, ai receptionist prompt engineering
**Industry:** cross-cut
**Word count target:** 1,500-2,000
**Tier:** 4 — implementation / how-to
**Score:** CI 2 / SO 3 / AF 3 = 8/9

## Why this topic

Closes the single biggest objection in every demo: "won't this sound robotic?" SERP is dominated by vendor pages with generic advice ("use clear language"). A real, vertical-specific prompt template — coaching studio, dental front desk, legal intake, restaurant — is rare. Readers want the templates, which makes this both an educational post AND a signup magnet.

## Must-cover questions (→ FAQ entries)

1. What makes an AI receptionist sound natural vs robotic?
2. What are the components of a good receptionist prompt?
3. How long should the greeting be?
4. How do I handle the "wait, I need to speak to a human" turn?
5. How do I write escalation rules into the prompt?
6. How do I iterate on a prompt without breaking what's working?

## Internal link targets

- Product page: /ai-receptionist
- Feature deep-dive: smart-escalation-when-ai-hands-to-human (T4-4)
- Industry pages: /industry/coaching, /industry/healthcare, /industry/legal, /industry/restaurant
- Sibling posts: how-to-set-up-ai-receptionist (T4-2)

## Original artifact to create

Three named-vertical prompt templates: **coaching studio greeting + intake**, **dental front desk + booking**, **legal intake + qualification.** Each ~80 words, copy-pasteable. Plus a one-page "prompt teardown" of a real Autocrew deployment showing what each block of the prompt does.

Optional download: a Notion or Google Doc template page (gated by email).

## Visual asset

Cover image — director's note: a clean code-editor-style view showing a prompt being built block by block, with a phone-call waveform morphing alongside; designer feel.

## AEO summary draft

A natural-sounding AI receptionist prompt has six components: a short branded greeting, a clear ask ("what brings you in today?"), data-capture turns kept under 80 words each, explicit escalation triggers, a graceful "I'll get a human" fallback, and an iteration loop based on real call transcripts. The biggest mistake is over-scripting — long, formal greetings make the AI sound like a phone tree. The second biggest is under-scripting — vague prompts let the model improvise into compliance trouble.

## Competitive gap

Most existing prompt-writing posts are generic "best practices" lists. None publish three actual vertical templates a reader can paste in. Autocrew's home-page wedge already names the four verticals — pull templates straight from the existing industry docs to make this post first-party.

## Sources to cite

- Smith.ai — AI Receptionist Prompting: https://smith.ai/blog/ai-receptionist-prompting
- Upfirst — Best Prompts to Train Your AI Receptionist: https://upfirst.ai/blog/best-prompts-train-ai-receptionist
- ServiceAgent — AI Receptionist Prompts Examples 2025: https://serviceagent.ai/blogs/ai-receptionist-prompts/
- MyAIFrontDesk — Crafting the Best AI Voice Receptionist Prompt: https://www.myaifrontdesk.com/blogs/crafting-the-best-ai-voice-receptionist-prompt-for-seamless-business-communication-a8983
- Greetly AI — Prompt Engineering Guidelines: https://www.greetlyai.com/blog/prompt-engineering-guidelines-for-ai-receptionists
- Retell — 5 Useful Prompts for AI Agent Builders: https://www.retellai.com/blog/5-useful-prompts-for-building-ai-voice-agents-on-retell-ai
