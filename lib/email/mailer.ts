import nodemailer from 'nodemailer';

// Gmail transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify transporter configuration on startup
if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
  transporter.verify((error) => {
    if (error) {
      console.error('Email transporter verification failed:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Gmail
 */
export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
  try {
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn('Gmail credentials not configured. Email not sent.');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('Content:', text || html);
      return { success: false, error: 'Email service not configured' };
    }

    const info = await transporter.sendMail({
      from: `"AutoCrew" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}

/**
 * Generate password reset email HTML
 */
export function generatePasswordResetEmail(resetUrl: string, userName: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - AutoCrew</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 20px;
      font-size: 16px;
      color: #555;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #0891b2;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background-color: #0284c7;
    }
    .footer {
      background-color: #f8f8f8;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #777;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .security-notice {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-notice p {
      margin: 0;
      font-size: 14px;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ AutoCrew</h1>
    </div>
    <div class="content">
      <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
      <p>Hi ${userName},</p>
      <p>We received a request to reset your password for your AutoCrew account. Click the button below to create a new password:</p>

      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>

      <p style="font-size: 14px; color: #777;">Or copy and paste this link into your browser:</p>
      <p style="font-size: 14px; word-break: break-all; color: #0891b2;">
        ${resetUrl}
      </p>

      <div class="security-notice">
        <p><strong>Security Notice:</strong> This password reset link will expire in 1 hour. If you didn't request this reset, please ignore this email or contact support if you have concerns.</p>
      </div>

      <p>Best regards,<br>The AutoCrew Team</p>
    </div>
    <div class="footer">
      <p>AutoCrew - AI-Powered Automation Platform</p>
      <p>This email was sent to ${userName}. If you didn't request this, please ignore it.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Hi ${userName},

We received a request to reset your password for your AutoCrew account.

Click the link below to create a new password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this reset, please ignore this email.

Best regards,
The AutoCrew Team
  `;

  return { html, text };
}

/**
 * Generate magic link invitation email HTML
 */
export function generateMagicLinkEmail(magicLinkUrl: string, userEmail: string) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AutoCrew - Set Up Your Account</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .header {
      background: linear-gradient(135deg, #0891b2 0%, #0284c7 100%);
      color: #ffffff;
      padding: 40px 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
    }
    .content p {
      margin: 0 0 20px;
      font-size: 16px;
      color: #555;
    }
    .button {
      display: inline-block;
      padding: 16px 40px;
      background-color: #0891b2;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 16px;
      margin: 20px 0;
      text-align: center;
    }
    .button:hover {
      background-color: #0284c7;
    }
    .footer {
      background-color: #f8f8f8;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #777;
      border-top: 1px solid #e0e0e0;
    }
    .footer p {
      margin: 5px 0;
    }
    .security-notice {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .security-notice p {
      margin: 0;
      font-size: 14px;
      color: #856404;
    }
    .welcome-box {
      background-color: #f0f9ff;
      border-left: 4px solid #0891b2;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .welcome-box h2 {
      margin: 0 0 10px;
      color: #0891b2;
      font-size: 20px;
    }
    .welcome-box p {
      margin: 0;
      color: #555;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⚡ AutoCrew</h1>
    </div>
    <div class="content">
      <h2 style="color: #333; margin-top: 0;">Welcome to AutoCrew!</h2>
      <p>Hi there,</p>

      <div class="welcome-box">
        <h2>You've Been Invited</h2>
        <p>An administrator has invited you to join AutoCrew. Click the button below to verify your email and set up your password.</p>
      </div>

      <p>To get started, click the button below to set up your account:</p>

      <div style="text-align: center;">
        <a href="${magicLinkUrl}" class="button">Set Up My Account</a>
      </div>

      <p style="font-size: 14px; color: #777;">Or copy and paste this link into your browser:</p>
      <p style="font-size: 14px; word-break: break-all; color: #0891b2;">
        ${magicLinkUrl}
      </p>

      <div class="security-notice">
        <p><strong>Security Notice:</strong> This invitation link will expire in 1 hour. If you didn't expect this invitation or have any concerns, please contact your administrator or ignore this email.</p>
      </div>

      <p><strong>What happens next?</strong></p>
      <ul style="color: #555;">
        <li>Click the link above to verify your email address</li>
        <li>Create a secure password for your account</li>
        <li>Start using AutoCrew's AI-powered automation platform</li>
      </ul>

      <p>If you have any questions, please don't hesitate to reach out to your administrator.</p>

      <p>Best regards,<br>The AutoCrew Team</p>
    </div>
    <div class="footer">
      <p>AutoCrew - AI-Powered Automation Platform</p>
      <p>This email was sent to ${userEmail}. If you didn't request this, please ignore it.</p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Welcome to AutoCrew!

Hi there,

You've been invited to join AutoCrew. An administrator has invited you to join the platform.

To get started, click the link below to verify your email and set up your password:
${magicLinkUrl}

Security Notice: This invitation link will expire in 1 hour. If you didn't expect this invitation or have any concerns, please contact your administrator.

What happens next?
- Click the link above to verify your email address
- Create a secure password for your account
- Start using AutoCrew's AI-powered automation platform

If you have any questions, please don't hesitate to reach out to your administrator.

Best regards,
The AutoCrew Team

---
This email was sent to ${userEmail}. If you didn't request this, please ignore it.
  `;

  return { html, text };
}
