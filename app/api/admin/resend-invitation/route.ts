import { NextRequest, NextResponse } from 'next/server';
import { isSuperAdmin } from '@/lib/auth/session-helpers';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user as userTable, account as accountTable } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

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
  try {
    // Verify SuperAdmin session
    if (!await isSuperAdmin()) {
      return NextResponse.json(
        {
          success: false,
          error: 'Forbidden - SuperAdmin access required',
        },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validation = resendInvitationSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check if user exists
    const existingUser = await db
      .select({ id: userTable.id, name: userTable.name, email: userTable.email })
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
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
      return NextResponse.json(
        {
          success: false,
          error: 'User has already set their password',
        },
        { status: 409 }
      );
    }

    // Send password reset email using Better Auth API (which serves as the invitation)
    console.log('[Resend Invitation] Sending password reset request for:', email);

    try {
      const resetResult = await auth.api.requestPasswordReset({
        body: {
          email: email,
          redirectTo: '/reset-password',
        },
      });

      console.log('[Resend Invitation] Password reset result:', resetResult);
      console.log(`[Resend Invitation] Invitation email resent to ${email}`);

      return NextResponse.json(
        {
          success: true,
          message: `Invitation email resent to ${email}`,
        },
        { status: 200 }
      );
    } catch (resetError) {
      console.error('[Resend Invitation] Failed to send password reset:', resetError);

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send invitation email',
          details: resetError instanceof Error ? resetError.message : 'Unknown error',
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('[Resend Invitation] POST /api/admin/resend-invitation error:', error);
    console.error('[Resend Invitation] Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to resend invitation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
