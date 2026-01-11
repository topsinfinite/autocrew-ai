import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { organization, magicLink } from "better-auth/plugins";
import { db } from "@/db";
import * as schema from "@/db/schema";
import { sendEmail, generatePasswordResetEmail, generateMagicLinkEmail } from "@/lib/email/mailer";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...schema,
    },
  }),

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "client_admin",
        input: false, // Don't allow users to set this directly
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Disabled for MVP, can enable later
    async sendResetPassword(data) {
      const { user, url } = data;
      const userName = user.name || user.email.split('@')[0];

      // Generate email content
      const { html, text } = generatePasswordResetEmail(url, userName);

      // Send email
      const result = await sendEmail({
        to: user.email,
        subject: 'Reset Your AutoCrew Password',
        html,
        text,
      });

      if (!result.success) {
        console.error('Failed to send password reset email:', result.error);
        // Still log for development/debugging
        console.log("Password reset URL:", url);
        console.log("User:", user.email);
      } else {
        console.log(`Password reset email sent to ${user.email}`);
      }
    },
    // Block public signup attempts
    async onSignUp({ email }: { email: string }) {
      throw new Error(
        'Public signup is disabled. Please contact your organization administrator for an invitation.'
      );
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  trustedOrigins: [
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    process.env.BETTER_AUTH_URL || "http://localhost:3000",
    "http://localhost:3000",
    "https://autocrew-saas.vercel.app",
  ],

  plugins: [
    magicLink({
      disableSignUp: true, // Prevent new signups via magic link
      expiresIn: 60 * 60, // 1 hour expiry
      async sendMagicLink({ email, url, token }) {
        // Generate email content
        const { html, text } = generateMagicLinkEmail(url, email);

        // Send email
        const result = await sendEmail({
          to: email,
          subject: 'Welcome to AutoCrew - Set Up Your Account',
          html,
          text,
        });

        if (!result.success) {
          console.error('Failed to send magic link email:', result.error);
          // Still log for development/debugging
          console.log("Magic link URL:", url);
          console.log("User email:", email);
        } else {
          console.log(`Magic link email sent to ${email}`);
        }
      },
    }),
    organization({
      // Custom schema mapping to clients table
      schema: {
        organization: {
          modelName: "clients",
          fields: {
            name: "companyName",
            slug: "slug",
            // Additional fields mapping
            metadata: "metadata",
            logo: "logo",
            createdAt: "createdAt",
            updatedAt: "updatedAt",
          },
        },
        member: {
          modelName: "member",
          fields: {
            organizationId: "organizationId",
            userId: "userId",
            role: "role",
            createdAt: "createdAt",
          },
        },
        invitation: {
          modelName: "invitation",
          fields: {
            organizationId: "organizationId",
            email: "email",
            role: "role",
            status: "status",
            expiresAt: "expiresAt",
            inviterId: "inviterId",
          },
        },
      },
      // Enforce one organization per user
      organizationLimit: 1,
      // Allow admins to create organizations
      allowUserToCreateOrganization: async () => {
        // Only SuperAdmin can create organizations via admin panel
        // For now, return false to prevent user-created organizations
        return false;
      },
    }),
  ],
});

// Export types for use in other parts of the application
export type Session = typeof auth.$Infer.Session;
