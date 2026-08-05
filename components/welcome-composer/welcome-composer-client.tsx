"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  LOCATION_OPTIONS,
  VERTICAL_OPTIONS,
  buildMailto,
  getSequence,
  listSequencesByGroup,
  renderBody,
  renderSubject,
  resolveStepBody,
  toTokenValues,
  type Locations,
  type PackageSlug,
  type Vertical,
} from "@/lib/welcome-sequences";

type Props = {
  frictionLogHref: string;
};

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function WelcomeComposerClient({ frictionLogHref }: Props) {
  const groups = useMemo(() => listSequencesByGroup(), []);

  const [packageSlug, setPackageSlug] =
    useState<PackageSlug>("ai-receptionist");
  const sequence = getSequence(packageSlug);

  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [company, setCompany] = useState("");
  const [vertical, setVertical] = useState<Vertical>("other");
  const [locations, setLocations] = useState<Locations>("1");
  const [goLive, setGoLive] = useState("");
  const [promisedOutcome, setPromisedOutcome] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerEmail, setOwnerEmail] = useState("");
  const [beehiivConfirmed, setBeehiivConfirmed] = useState(false);
  const [day0Copied, setDay0Copied] = useState(false);
  const [copyFlash, setCopyFlash] = useState<string | null>(null);

  const verticalLocked = Boolean(sequence.lockedVertical);
  const effectiveVertical = sequence.lockedVertical ?? vertical;

  function onPackageChange(slug: PackageSlug) {
    setPackageSlug(slug);
    const next = getSequence(slug);
    if (next.lockedVertical) {
      setVertical(next.lockedVertical);
    }
  }

  const tokens = toTokenValues({
    adminName,
    company,
    packageSlug,
    vertical: effectiveVertical,
    locations,
    goLive,
    promisedOutcome,
    ownerName,
    ownerEmail,
  });

  const day0Ready =
    adminName.trim() &&
    adminEmail.trim() &&
    company.trim() &&
    promisedOutcome.trim() &&
    ownerName.trim() &&
    ownerEmail.trim() &&
    beehiivConfirmed;

  function flash(msg: string) {
    setCopyFlash(msg);
    window.setTimeout(() => setCopyFlash(null), 2000);
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header className="space-y-2 border-b border-border pb-6">
        <p className="text-xs uppercase tracking-widest text-muted-foreground">
          Internal · Sales / CS
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">
          Welcome Composer
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Fill intake → copy plain-text emails → send from the assigned human
          inbox. No Beehiiv. No auto-send. Customer fields stay in this tab
          only.
        </p>
      </header>

      <section className="space-y-4 rounded-lg border border-border bg-background/30 p-5">
        <h2 className="text-sm font-medium">Intake</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Admin name" htmlFor="adminName">
            <Input
              id="adminName"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              required
            />
          </Field>
          <Field label="Admin email" htmlFor="adminEmail">
            <Input
              id="adminEmail"
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Company" htmlFor="company">
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </Field>

          <Field label="Package" htmlFor="package">
            <Select
              value={packageSlug}
              onValueChange={(v) => onPackageChange(v as PackageSlug)}
            >
              <SelectTrigger id="package">
                <SelectValue placeholder="Select package" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectGroup key={g.group}>
                    <SelectLabel>{g.label}</SelectLabel>
                    {g.packages.map((p) => (
                      <SelectItem key={p.slug} value={p.slug}>
                        {p.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Vertical" htmlFor="vertical">
            <Select
              value={effectiveVertical}
              onValueChange={(v) => setVertical(v as Vertical)}
              disabled={verticalLocked}
            >
              <SelectTrigger id="vertical">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VERTICAL_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {verticalLocked ? (
              <p className="mt-1 text-xs text-muted-foreground">
                Locked by package selection
              </p>
            ) : null}
          </Field>

          <Field label="Locations" htmlFor="locations">
            <Select
              value={locations}
              onValueChange={(v) => setLocations(v as Locations)}
            >
              <SelectTrigger id="locations">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LOCATION_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>

          <Field label="Go-live (optional)" htmlFor="goLive">
            <Input
              id="goLive"
              value={goLive}
              onChange={(e) => setGoLive(e.target.value)}
              placeholder="e.g. 2026-08-12"
            />
          </Field>

          <Field label="Owner name (sender)" htmlFor="ownerName">
            <Input
              id="ownerName"
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              required
            />
          </Field>
          <Field label="Owner email (send from)" htmlFor="ownerEmail">
            <Input
              id="ownerEmail"
              type="email"
              value={ownerEmail}
              onChange={(e) => setOwnerEmail(e.target.value)}
              required
            />
          </Field>
        </div>

        <Field label="Promised outcome (required for Day 0)" htmlFor="outcome">
          <Textarea
            id="outcome"
            value={promisedOutcome}
            onChange={(e) => setPromisedOutcome(e.target.value)}
            rows={3}
            placeholder="One sentence sales committed on the call"
          />
        </Field>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            className="mt-1"
            checked={beehiivConfirmed}
            onChange={(e) => setBeehiivConfirmed(e.target.checked)}
          />
          <span>
            Confirm customer is <strong>not</strong> added to the
            Journal/Beehiiv list
          </span>
        </label>

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            className="mt-1"
            checked={day0Copied}
            onChange={(e) => setDay0Copied(e.target.checked)}
          />
          <span>Day 0 copied (local reminder only)</span>
        </label>

        <p className="text-xs text-muted-foreground">
          Site source:{" "}
          <code className="text-foreground/80">{sequence.siteSource}</code>
          {" · "}
          Send from:{" "}
          <span className="text-foreground">
            {ownerEmail.trim() || "(set owner email)"}
          </span>
        </p>
      </section>

      {copyFlash ? (
        <p className="text-sm text-primary" role="status">
          {copyFlash}
        </p>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <h2 className="text-sm font-medium">Sequence</h2>
          <a
            href={frictionLogHref}
            className="text-xs text-primary underline-offset-4 hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            Log friction → docs/post-sale-friction.md
          </a>
        </div>

        {sequence.steps.map((step) => {
          const isStub = step.status === "stub";
          const bodyTemplate = resolveStepBody(sequence, step, locations);
          const subjectResult = renderSubject(step.subject, tokens);
          const bodyResult = renderBody(bodyTemplate, tokens);
          const unknown = [
            ...new Set([
              ...subjectResult.unknownTokens,
              ...bodyResult.unknownTokens,
            ]),
          ];
          const step0Blocked =
            step.id === 0 && (!promisedOutcome.trim() || !beehiivConfirmed);
          const canCopy =
            !isStub &&
            unknown.length === 0 &&
            Boolean(day0Ready) &&
            !step0Blocked &&
            subjectResult.ok &&
            bodyResult.ok;

          const mailto =
            canCopy && ownerEmail.trim() && adminEmail.trim()
              ? buildMailto({
                  to: adminEmail.trim(),
                  subject: subjectResult.subject,
                  body: bodyResult.body,
                })
              : null;

          return (
            <article
              key={step.id}
              className="space-y-3 rounded-lg border border-border bg-background/20 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-medium">
                    Step {step.id} · {step.timing}
                  </h3>
                  <p className="text-xs text-muted-foreground">{step.job}</p>
                </div>
                <span
                  className={
                    isStub
                      ? "rounded-full bg-amber-500/15 px-2 py-0.5 text-xs text-amber-400"
                      : "rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400"
                  }
                >
                  {isStub ? "stub — do not schedule" : "authored"}
                </span>
              </div>

              {isStub ? (
                <p className="text-sm text-amber-200/90">
                  Step not authored yet — do not schedule. Day 0 only for this
                  package until friction log says otherwise.
                </p>
              ) : (
                <>
                  {unknown.length > 0 ? (
                    <p className="text-sm text-destructive" role="alert">
                      Unknown tokens: {unknown.map((t) => `{{${t}}}`).join(", ")}
                      . Copy disabled.
                    </p>
                  ) : null}

                  {step.id === 0 && !promisedOutcome.trim() ? (
                    <p className="text-sm text-amber-200/90">
                      Promised outcome required before copying Day 0.
                    </p>
                  ) : null}

                  {!beehiivConfirmed ? (
                    <p className="text-sm text-amber-200/90">
                      Confirm Beehiiv checklist before copying.
                    </p>
                  ) : null}

                  <div className="space-y-1">
                    <Label>Subject</Label>
                    <pre className="overflow-x-auto whitespace-pre-wrap rounded-md border border-border bg-black/40 p-3 text-xs">
                      {subjectResult.subject || "(empty)"}
                    </pre>
                  </div>
                  <div className="space-y-1">
                    <Label>Body (plain text)</Label>
                    <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-border bg-black/40 p-3 text-xs leading-relaxed">
                      {bodyResult.body || "(empty)"}
                    </pre>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      size="sm"
                      disabled={!canCopy}
                      onClick={async () => {
                        const ok = await copyText(subjectResult.subject);
                        flash(ok ? "Subject copied" : "Copy failed");
                      }}
                    >
                      Copy subject
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      disabled={!canCopy}
                      onClick={async () => {
                        const ok = await copyText(bodyResult.body);
                        if (ok && step.id === 0) setDay0Copied(true);
                        flash(ok ? "Body copied" : "Copy failed");
                      }}
                    >
                      Copy body
                    </Button>
                    {mailto ? (
                      <Button type="button" size="sm" variant="outline" asChild>
                        <a href={mailto}>Open mailto</a>
                      </Button>
                    ) : (
                      <Button type="button" size="sm" variant="outline" disabled>
                        mailto unavailable
                      </Button>
                    )}
                  </div>
                </>
              )}
            </article>
          );
        })}
      </section>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}
