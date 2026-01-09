import { NextRequest, NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth/session-helpers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user as userTable, account as accountTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import { logger, successResponse, errorResponse, ErrorCodes, sanitizePII } from '@/lib/utils';

/**
 * Validation schema for resending invitation
 */
const resendInvitationSchema = z.object({
  email: z.string().email('Invalid email address'),
});

/**
 * POST /api/admin/resend-invitation
 * Resend invitation email to a user who hasn't set their password yet
 *
 * Only SuperAdmin can access this endpoint
 *
 * Request body:
 * {
 *   email: string
 * }
 */
export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    await logger.info('Resend invitation request received', { requestId });

    // Verify SuperAdmin session
    if (!await isSuperAdmin()) {
      await logger.warn('Resend invitation failed - insufficient permissions', {
        requestId,
      });
      return errorResponse(ErrorCodes.PERMISSION_SUPER_ADMIN_REQUIRED, null, requestId);
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = resendInvitationSchema.safeParse(body);

    if (!validation.success) {
      await logger.warn('Resend invitation validation failed', {
        requestId,
        errors: validation.error.issues,
      });
      return errorResponse(ErrorCodes.VALIDATION_FAILED, validation.error.issues, requestId);
    }

    const { email } = validation.data;

    // Check if user exists
    const existingUser = await db
      .select({ id: userTable.id, name: userTable.name, email: userTable.email })
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      await logger.warn('Resend invitation failed - user not found', {
        requestId,
        email: sanitizePII({ email }).email,
      });
      return errorResponse(ErrorCodes.USER_NOT_FOUND, null, requestId);
    }

    const user = existingUser[0];

    // Check if user already has a password
    const existingAccount = await db
      .select({ id: accountTable.id, password: accountTable.password })
      .from(accountTable)
      .where(
        and(
          eq(accountTable.userId, user.id),
          eq(accountTable.providerId, 'credential')
        )
      )
      .limit(1);

    if (existingAccount.length > 0 && existingAccount[0].password) {
      await logger.warn('Resend invitation failed - user already has password', {
        requestId,
        userId: user.id,
        email: sanitizePII({ email }).email,
      });
      return errorResponse(
        {
          code: 'PASSWORD_ALREADY_SET',
          status: 409,
          message: 'User has already set their password',
        },
        null,
        requestId
      );
    }

    // Send password reset email using Better Auth API (which serves as the invitation)
    await logger.info('Sending password reset request', {
      requestId,
      userId: user.id,
      email: sanitizePII({ email }).email,
      operation: 'resend_invitation',
    });

    try {
      const resetResult = await auth.api.requestPasswordReset({
        body: {
          email: email,
          redirectTo: '/reset-password',
        },
      });

      const duration = Date.now() - startTime;
      await logger.info('Invitation email resent successfully', {
        requestId,
        userId: user.id,
        email: sanitizePII({ email }).email,
        duration,
        operation: 'resend_invitation',
      });

      return successResponse(
        { userId: user.id },
        `Invitation email resent to ${email}`,
        requestId
      );
    } catch (resetError) {
      const duration = Date.now() - startTime;
      await logger.error(
        'Failed to send invitation email',
        {
          requestId,
          userId: user.id,
          email: sanitizePII({ email }).email,
          duration,
          operation: 'resend_invitation',
        },
        resetError
      );

      return errorResponse(ErrorCodes.EXTERNAL_EMAIL_ERROR, resetError, requestId);
    }
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Resend invitation failed',
      {
        requestId,
        duration,
        operation: 'resend_invitation',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
