import { NextRequest } from 'next/server';
import { createHash } from 'crypto';
import { db } from '@/db';
import { crews, clients, member } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { requireAuth, isSuperAdmin } from '@/lib/auth/session-helpers';
import type { CrewConfig } from '@/types';
import { widgetSettingsSchema } from '@/lib/validations/crew.schema';
import { logger, successResponse, errorResponse, ErrorCodes, sanitizePII } from '@/lib/utils';

/**
 * Generate SHA-256 hash of crew code and allowed domain
 * Used for origin validation in n8n chat trigger
 */
function generateOriginHash(crewCode: string, allowedDomain: string): string {
  return createHash('sha256')
    .update(`${crewCode}:${allowedDomain}`)
    .digest('hex');
}

/**
 * PATCH /api/crews/[id]/config
 * Update crew configuration (support settings and/or widget settings)
 *
 * Authorization:
 * - SuperAdmin: Can update any crew's configuration
 * - Client Admin: Can only update crews from their organization
 *
 * Request body:
 * {
 *   // Support configuration (all required if any provided)
 *   supportEmail?: string
 *   supportClientName?: string
 *   allowedDomain?: string
 *
 *   // Widget customization (all optional)
 *   widgetSettings?: {
 *     primaryColor?: string      // Hex color e.g., "#0891b2"
 *     position?: 'bottom-right' | 'bottom-left'
 *     theme?: 'light' | 'dark' | 'auto'
 *     widgetTitle?: string
 *     widgetSubtitle?: string
 *     welcomeMessage?: string
 *     firstLaunchAction?: 'none' | 'auto-open' | 'show-greeting'
 *     greetingDelay?: number
 *   }
 * }
 *
 * The API generates a SHA-256 hash of crewCode:allowedDomain for origin validation
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    // Verify authentication
    const session = await requireAuth();
    const { id } = await params;
    const body = await request.json();
    const { supportEmail, supportClientName, agentName, allowedDomain, widgetSettings } = body;

    // Check if support config is being updated
    const isUpdatingSupportConfig = supportEmail || supportClientName || agentName || allowedDomain;

    await logger.info('Update crew config request received', {
      requestId,
      crewId: id,
      userId: session.user.id,
      supportEmail: supportEmail ? sanitizePII({ email: supportEmail }).email : undefined,
      allowedDomain,
      hasWidgetSettings: !!widgetSettings,
    });

    // Validate support config if any support field is provided
    if (isUpdatingSupportConfig) {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!supportEmail || !emailRegex.test(supportEmail)) {
        await logger.warn('Update crew config failed - invalid email', {
          requestId,
          crewId: id,
          supportEmail: supportEmail ? sanitizePII({ email: supportEmail }).email : undefined,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: 'Valid support email is required',
          },
          null,
          requestId
        );
      }

      // Validate client name
      if (!supportClientName || supportClientName.trim().length === 0) {
        await logger.warn('Update crew config failed - missing client name', {
          requestId,
          crewId: id,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: 'Support client name is required',
          },
          null,
          requestId
        );
      }

      // Validate agent name
      if (!agentName || agentName.trim().length < 2) {
        await logger.warn('Update crew config failed - invalid agent name', {
          requestId,
          crewId: id,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: 'Agent name is required (at least 2 characters)',
          },
          null,
          requestId
        );
      }

      if (agentName.trim().length > 50) {
        await logger.warn('Update crew config failed - agent name too long', {
          requestId,
          crewId: id,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: 'Agent name must be at most 50 characters',
          },
          null,
          requestId
        );
      }

      // Validate allowed domain
      const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*$/;
      if (!allowedDomain || !domainRegex.test(allowedDomain.trim())) {
        await logger.warn('Update crew config failed - invalid allowed domain', {
          requestId,
          crewId: id,
          allowedDomain,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: 'Valid allowed domain is required (e.g., example.com)',
          },
          null,
          requestId
        );
      }
    }

    // Validate widget settings if provided
    if (widgetSettings) {
      const widgetValidation = widgetSettingsSchema.safeParse(widgetSettings);
      if (!widgetValidation.success) {
        await logger.warn('Update crew config failed - invalid widget settings', {
          requestId,
          crewId: id,
          errors: widgetValidation.error.issues,
        });
        return errorResponse(
          {
            code: 'VALIDATION_FAILED',
            status: 400,
            message: widgetValidation.error.issues[0]?.message || 'Invalid widget settings',
          },
          null,
          requestId
        );
      }
    }

    // Ensure at least one type of update is being made
    if (!isUpdatingSupportConfig && !widgetSettings) {
      return errorResponse(
        {
          code: 'VALIDATION_FAILED',
          status: 400,
          message: 'No configuration provided to update',
        },
        null,
        requestId
      );
    }

    // Fetch crew
    const [crew] = await db.select().from(crews).where(eq(crews.id, id)).limit(1);
    if (!crew) {
      await logger.warn('Update crew config failed - crew not found', {
        requestId,
        crewId: id,
      });
      return errorResponse(ErrorCodes.CREW_NOT_FOUND, null, requestId);
    }

    // Authorization: SuperAdmin or Client Admin from same org
    if (!await isSuperAdmin()) {
      const userId = session.user.id;
      const membership = await db
        .select()
        .from(member)
        .innerJoin(clients, eq(member.organizationId, clients.id))
        .where(and(
          eq(member.userId, userId),
          eq(clients.clientCode, crew.clientId)
        ))
        .limit(1);

      if (membership.length === 0) {
        await logger.warn('Update crew config failed - insufficient permissions', {
          requestId,
          crewId: id,
          userId,
          clientId: crew.clientId,
        });
        return errorResponse(
          {
            code: 'PERMISSION_DENIED',
            status: 403,
            message: 'You can only update crews from your organization',
          },
          null,
          requestId
        );
      }
    }

    // Build updated config
    const currentConfig = crew.config as CrewConfig;
    const updatedConfig: CrewConfig = { ...currentConfig };

    // Update support config if provided
    if (isUpdatingSupportConfig) {
      const documentsUploaded = currentConfig.activationState?.documentsUploaded ?? false;
      const supportConfigured = true; // Support is now configured
      const activationReady = documentsUploaded && supportConfigured;

      // Generate origin hash for n8n validation
      const trimmedDomain = allowedDomain.trim().toLowerCase();
      const originHash = generateOriginHash(crew.crewCode, trimmedDomain);

      updatedConfig.metadata = {
        ...currentConfig.metadata,
        support_email: supportEmail,
        support_client_name: supportClientName.trim(),
        agent_name: agentName.trim(),
        allowed_domain: trimmedDomain,
        origin_hash: originHash,
      };
      updatedConfig.activationState = {
        documentsUploaded,
        supportConfigured,
        activationReady,
      };
    }

    // Update widget settings if provided
    if (widgetSettings) {
      updatedConfig.widgetSettings = {
        ...currentConfig.widgetSettings,
        ...widgetSettings,
      };
    }

    const [updatedCrew] = await db
      .update(crews)
      .set({
        config: updatedConfig,
        updatedAt: new Date()
      })
      .where(eq(crews.id, id))
      .returning();

    const duration = Date.now() - startTime;
    await logger.info('Crew config updated successfully', {
      requestId,
      crewId: id,
      crewCode: crew.crewCode,
      supportEmail: supportEmail ? sanitizePII({ email: supportEmail }).email : undefined,
      supportClientName: supportClientName || undefined,
      agentName: agentName || undefined,
      allowedDomain: allowedDomain ? allowedDomain.trim().toLowerCase() : undefined,
      hasWidgetSettings: !!widgetSettings,
      duration,
      operation: 'update_crew_config',
    });

    const message = isUpdatingSupportConfig && widgetSettings
      ? 'Configuration updated successfully'
      : isUpdatingSupportConfig
      ? 'Support configuration updated successfully'
      : 'Widget settings updated successfully';

    return successResponse(updatedCrew, message, requestId);
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Failed to update crew configuration',
      {
        requestId,
        duration,
        operation: 'update_crew_config',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
