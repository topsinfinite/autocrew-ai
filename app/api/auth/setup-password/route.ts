import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { requireAuth } from '@/lib/auth/session-helpers';
import { db } from '@/db';
import { user as userTable, account as accountTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { logger, successResponse, errorResponse, ErrorCodes } from '@/lib/utils';

/**
 * Validation schema for password setup
 */
const setupPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
});

/**
 * POST /api/auth/setup-password
 * Set password for a user who authenticated via magic link
 *
 * This endpoint is called after a user clicks a magic link invitation
 * and needs to set their password for the first time.
 *
 * Security:
 * - User must be authenticated (via magic link session)
 * - User must not already have a password set
 * - Password must meet strength requirements
 */
export async function POST(request: NextRequest) {
  const requestId = request.headers.get('x-request-id');
  const startTime = Date.now();

  try {
    await logger.info('Password setup request received', { requestId });

    // Verify user is authenticated
    const session = await requireAuth();

    if (!session) {
      await logger.warn('Password setup failed - not authenticated', { requestId });
      return errorResponse(ErrorCodes.AUTH_REQUIRED, null, requestId);
    }

    const userId = session.user.id;

    // Parse and validate request body
    const body = await request.json();
    const validation = setupPasswordSchema.safeParse(body);

    if (!validation.success) {
      await logger.warn('Password setup validation failed', {
        requestId,
        userId,
        error: validation.error.issues[0].message,
      });
      return errorResponse(
        ErrorCodes.VALIDATION_FAILED,
        validation.error.issues[0].message,
        requestId
      );
    }

    const { password } = validation.data;

    // Check if user exists
    const existingUser = await db
      .select({ id: userTable.id })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);

    if (existingUser.length === 0) {
      await logger.warn('Password setup failed - user not found', {
        requestId,
        userId,
      });
      return errorResponse(ErrorCodes.USER_NOT_FOUND, null, requestId);
    }

    // Check if user already has a password (account with credential provider)
    const existingAccount = await db
      .select({ id: accountTable.id, password: accountTable.password })
      .from(accountTable)
      .where(
        and(
          eq(accountTable.userId, userId),
          eq(accountTable.providerId, 'credential')
        )
      )
      .limit(1);

    if (existingAccount.length > 0 && existingAccount[0].password) {
      await logger.warn('Password setup failed - password already set', {
        requestId,
        userId,
      });
      return errorResponse(
        {
          code: 'PASSWORD_ALREADY_SET',
          status: 409,
          message: 'Password already set. Please use the login page.',
        },
        null,
        requestId
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create or update account with password
    if (existingAccount.length > 0) {
      // Update existing account
      await db
        .update(accountTable)
        .set({
          password: hashedPassword,
          updatedAt: new Date(),
        })
        .where(eq(accountTable.id, existingAccount[0].id));
    } else {
      // Create new account entry for credential provider
      await db.insert(accountTable).values({
        id: `account_${nanoid(16)}`,
        accountId: userId,
        providerId: 'credential',
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    // Mark email as verified
    await db
      .update(userTable)
      .set({
        emailVerified: true,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, userId));

    const duration = Date.now() - startTime;
    await logger.info('Password set successfully', {
      requestId,
      userId,
      duration,
      operation: 'setup_password',
    });

    return successResponse(
      { success: true },
      'Password set successfully',
      requestId
    );
  } catch (error) {
    const duration = Date.now() - startTime;
    await logger.error(
      'Password setup failed',
      {
        requestId,
        duration,
        operation: 'setup_password',
      },
      error
    );
    return errorResponse(ErrorCodes.INTERNAL_ERROR, error, requestId);
  }
}
