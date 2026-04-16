const BEEHIIV_API_URL = "https://api.beehiiv.com/v2";

const STATUS_AUTOMATION_MAP: Record<string, string | undefined> = {
  welcome: process.env.BEEHIIV_AUTOMATION_WELCOME,
};

function assertBeehiivConfig(): { apiKey: string; publicationId: string } {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;
  if (!apiKey) throw new Error("BEEHIIV_API_KEY environment variable is not set");
  if (!publicationId)
    throw new Error("BEEHIIV_PUBLICATION_ID environment variable is not set");
  return { apiKey, publicationId };
}

type BeehiivSubscriberPayload = {
  email: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  referring_site?: string;
  custom_fields?: { name: string; value: string }[];
  reactivate_existing?: boolean;
  send_welcome_email?: boolean;
};

type BeehiivSubscriberResponse = {
  data: { id: string; email: string; status: string };
};

export async function createSubscriber(payload: {
  email: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}): Promise<string> {
  const { apiKey, publicationId } = assertBeehiivConfig();

  const body: BeehiivSubscriberPayload = {
    email: payload.email,
    reactivate_existing: true,
    send_welcome_email: false,
    utm_source: payload.utmSource ?? "autocrew-ai",
    utm_medium: payload.utmMedium ?? "signup-form",
    utm_campaign: payload.utmCampaign ?? "launch",
    referring_site: "https://autocrew-ai.com",
    custom_fields: [],
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
    throw new Error(`Beehiiv API error: ${response.status} ${errorText}`);
  }

  const data: BeehiivSubscriberResponse = await response.json();
  const subscriberId = data.data.id;

  try {
    await enrollInAutomation(payload.email, "welcome");
  } catch (automationError) {
    console.error(
      "Beehiiv automation enrollment failed (subscriber was created):",
      automationError instanceof Error
        ? automationError.message
        : automationError,
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

export async function enrollInAutomation(
  email: string,
  status: string,
): Promise<void> {
  const { apiKey, publicationId } = assertBeehiivConfig();
  const automationId = STATUS_AUTOMATION_MAP[status];

  if (!automationId) {
    console.warn(
      `No automation ID configured for status "${status}" — skipping enrollment`,
    );
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
      body: JSON.stringify({ email }),
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Beehiiv automation enrollment error: ${response.status} ${errorText}`,
    );
  }
}
