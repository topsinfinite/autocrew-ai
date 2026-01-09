import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isSuperAdmin } from '@/lib/auth/session-helpers';
import { db } from '@/db';
import { user as userTable, member, clients } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';
import { z } from 'zod';
import { sendEmail, generateMagicLinkEmail } from '@/lib/email/mailer';

/**
 * Validation schema for creating a client admin
 */
const createClientAdminSchema = z.object({
  email: z.string().email('Invalid email address'),
  name: z.string().min(1, 'Name is required'),
  clientId: z.string().min(1, 'Client ID is required'),
});

/**
 * POST /api/admin/create-client-admin
 * Create a new Client Admin user and link them to an organization
 *
 * Only SuperAdmin can access this endpoint
 *
 * Request body:
 * {
 *   email: string,
 *   name: string,
 *   clientId: string (organization ID)
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
    const validation = createClientAdminSchema.safeParse(body);

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

    const { email, name, clientId } = validation.data;

    // Check if user with this email already exists
    const existingUser = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'A user with this email already exists',
        },
        { status: 409 }
      );
    }

    // Verify client exists
    const client = await db
      .select()
      .from(clients)
      .where(eq(clients.id, clientId))
      .limit(1);

    if (client.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client not found',
        },
        { status: 404 }
      );
    }

    // Generate user ID
    const userId = `user_${nanoid(16)}`;

    // Create user without password (will be set via magic link)
    const [newUser] = await db
      .insert(userTable)
      .values({
        id: userId,
        email,
        name,
        emailVerified: false, // Will be verified when magic link is clicked
        role: 'client_admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .returning();

    // Create membership linking user to organization
    const memberId = `member_${nanoid(16)}`;
    await db
      .insert(member)
      .values({
        id: memberId,
        userId: userId,
        organizationId: clientId,
        role: 'admin', // Organization role (different from user role)
        createdAt: new Date(),
      });

    // Send invitation email with setup link using Better Auth API
    try {
      const resetResult = await auth.api.requestPasswordReset({
        body: {
          email: email,
          redirectTo: '/reset-password',
        },
      });

      console.log(`Invitation email sent to ${email} for ${client[0].companyName}`);
    } catch (emailError) {
      console.error('Failed to send invitation email:', emailError);

      // Log for development
      if (process.env.NODE_ENV === 'development') {
        console.log('\n========================================');
        console.log('New Client Admin Created (Email Send Failed)');
        console.log('========================================');
        console.log('Email:', email);
        console.log('Name:', name);
        console.log('Client:', client[0].companyName);
        console.log('User should navigate to /forgot-password and enter their email');
        console.log('========================================\n');
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role,
          clientId: clientId,
          clientName: client[0].companyName,
        },
        message: `Client Admin created successfully. Invitation email sent to ${email}`,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/admin/create-client-admin error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create client admin',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
