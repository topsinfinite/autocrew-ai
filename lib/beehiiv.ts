/**
 * Beehiiv Email Marketing Integration
 *
 * Handles Beehiiv API operations:
 * - Creating newsletter/lead-magnet subscribers
 * - Enrolling subscribers in automation sequences
 *
 * Production: https://api.beehiiv.com/v2
 */

const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";

const STATUS_AUTOMATION_MAP: Record<string, string | undefined> = {
  welcome: process.env.BEEHIIV_AUTOMATION_WELCOME,
  "roi-calculator": process.env.BEEHIIV_AUTOMATION_ROI_CALCULATOR,
};

function assertBeehiivConfig(): { apiKey: string; publicationId: string } {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey) throw new Error("BEEHIIV_API_KEY environment variable is not set");
  if (!publicationId) throw new Error("BEEHIIV_PUBLICATION_ID environment variable is not set");
  return { apiKey, publicationId };
}

type BeehiivSubscriberPayload = {
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_channel?: string;
  referring_site?: string;
  tags?: string[];
  custom_fields?: { name: string; value: string }[];
  reactivate_existing?: boolean;
  send_welcome_email?: boolean;
};

type BeehiivSubscriberResponse = {
  data: { id: string; email: string; status: string };
};

export async function createSubscriber(payload: {
  email: string;
  tags?: string[];
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  // legacy camelCase aliases (newsletter-signup route)
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  custom_fields?: { name: string; value: string }[];
  automationKey?: string;
}): Promise<string> {
  const { apiKey, publicationId } = assertBeehiivConfig();
  const email = payload.email.toLowerCase().trim();

  const body: BeehiivSubscriberPayload = {
    email,
    reactivate_existing: true,
    send_welcome_email: false,
    utm_source: payload.utm_source ?? payload.utmSource ?? "autocrew-ai",
    utm_medium: payload.utm_medium ?? payload.utmMedium ?? "signup-form",
    utm_campaign: payload.utm_campaign ?? payload.utmCampaign ?? "launch",
    tags: payload.tags,
    custom_fields: payload.custom_fields,
  };

  const response = await fetch(
    `${BEEHIIV_API_URL}/publications/${publicationId}/subscriptions`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Beehiiv subscriber creation failed: ${response.status} ${errorText}`);
  }

  const data: BeehiivSubscriberResponse = await response.json();
  const subscriberId = data.data.id;

  const automationKey = payload.automationKey ?? "welcome";
  try {
    await enrollInAutomation(email, automationKey);
  } catch (err) {
    console.error(
      `Beehiiv automation enrollment failed (subscriber was created):`,
      err instanceof Error ? err.message : String(err),
    );
  }

  return subscriberId;
}

export async function updateBeehiivTags(
  subscriberId: string,
  tagsToAdd: string[],
  tagsToRemove: string[],
): Promise<void> {
  const { apiKey, publicationId } = assertBeehiivConfig();

  const response = await fetch(
    `${BEEHIIV_API_URL}/publications/${publicationId}/subscriptions/${subscriberId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tags_to_add: tagsToAdd,
        tags_to_remove: tagsToRemove,
      }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Beehiiv tag update error: ${response.status} ${errorText}`);
  }
}

export async function enrollInAutomation(email: string, status: string): Promise<void> {
  const { apiKey, publicationId } = assertBeehiivConfig();
  const automationId = STATUS_AUTOMATION_MAP[status];

  if (!automationId) {
    console.warn(`No automation ID configured for status "${status}" — skipping enrollment`);
    return;
  }

  const response = await fetch(
    `${BEEHIIV_API_URL}/publications/${publicationId}/automations/${automationId}/journeys`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email.toLowerCase().trim() }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Beehiiv automation enrollment failed: ${response.status} ${errorText}`);
  }
}
