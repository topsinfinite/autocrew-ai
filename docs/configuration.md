# Configuration Guide

This document covers all configurable environment variables for the AutoCrew SaaS platform.

## Quick Reference

| Variable | Default | Description |
|----------|---------|-------------|
| `POSTGRES_URL` | - | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | - | JWT signing secret |
| `BETTER_AUTH_URL` | - | Auth base URL |
| `GMAIL_USER` | - | Gmail account for emails |
| `GMAIL_APP_PASSWORD` | - | Gmail app password |
| `N8N_API_KEY` | - | n8n webhook API key |
| `N8N_DOCUMENT_UPLOAD_WEBHOOK` | - | Document upload webhook URL |
| `CONVERSATION_DISCOVERY_CRON` | `*/5 * * * *` | Discovery job schedule |
| `ENABLE_BACKGROUND_JOBS` | `true` | Enable/disable background jobs |

---

## Database Configuration

### POSTGRES_URL

**Required**: Yes
**Format**: `postgresql://username:password@host:port/database`

PostgreSQL connection string for the application database.

**Example**:
```bash
POSTGRES_URL=postgresql://dev_user:dev_password@localhost:5432/autocrew_dev
```

---

## Authentication Configuration

### BETTER_AUTH_SECRET

**Required**: Yes
**Format**: Base64 string (32+ characters)

Secret key used for signing JWT tokens and encrypting session data.

**Generate**:
```bash
openssl rand -base64 32
```

**Example**:
```bash
BETTER_AUTH_SECRET=RTUSamHAjtFM/yjf7Pal8b+SqlZWkOiq7UIW7rpCSV8=
```

### BETTER_AUTH_URL

**Required**: Yes
**Format**: URL

Base URL for Better Auth callbacks and redirects.

**Development**:
```bash
BETTER_AUTH_URL=http://localhost:3000
```

**Production**:
```bash
BETTER_AUTH_URL=https://your-domain.com
```

### NEXT_PUBLIC_APP_URL

**Required**: Yes
**Format**: URL
**Note**: Client-side accessible (prefixed with `NEXT_PUBLIC_`)

Public URL of your application.

**Example**:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Email Configuration

### GMAIL_USER

**Required**: Yes (if using Gmail)
**Format**: Email address

Gmail account used for sending transactional emails.

**Example**:
```bash
GMAIL_USER=noreply@yourcompany.com
```

### GMAIL_APP_PASSWORD

**Required**: Yes (if using Gmail)
**Format**: 16-character app password (no spaces)

Gmail app-specific password for authentication.

**Generate**:
1. Go to [Google Account App Passwords](https://myaccount.google.com/apppasswords)
2. Create a new app password
3. Copy the password (remove all spaces)

**Example**:
```bash
GMAIL_APP_PASSWORD=abcdefghijklmnop
```

---

## n8n Integration Configuration

### N8N_API_KEY

**Required**: Yes
**Format**: String

API key for authenticating requests to n8n webhooks. Must match the value configured in n8n workflow.

**Example**:
```bash
N8N_API_KEY=autocrew_xyz123456abcdef
```

### N8N_DOCUMENT_UPLOAD_WEBHOOK

**Required**: Yes
**Format**: URL

Webhook endpoint for uploading knowledge base documents to n8n.

**Development**:
```bash
N8N_DOCUMENT_UPLOAD_WEBHOOK=http://localhost:5678/webhook/knowledgebase/document-upload
```

**Production**:
```bash
N8N_DOCUMENT_UPLOAD_WEBHOOK=https://n8n.yourcompany.com/webhook/knowledgebase/document-upload
```

---

## Background Jobs Configuration

### CONVERSATION_DISCOVERY_CRON

**Required**: No
**Default**: `*/5 * * * *` (every 5 minutes)
**Format**: Cron expression

Controls how frequently the system scans support histories tables for new conversations.

**Cron Syntax**: `minute hour day month weekday`

**Common Schedules**:

| Use Case | Schedule | Cron Expression |
|----------|----------|----------------|
| High-traffic (near real-time) | Every 2 minutes | `*/2 * * * *` |
| **Default (recommended)** | Every 5 minutes | `*/5 * * * *` |
| Medium-traffic | Every 10 minutes | `*/10 * * * *` |
| Low-traffic | Every 15 minutes | `*/15 * * * *` |
| Very low traffic | Every hour | `0 * * * *` |
| Nightly batch | Daily at 2am | `0 2 * * *` |
| Business hours only | M-F 9am-5pm hourly | `0 9-17 * * 1-5` |

**Examples**:

```bash
# Every 5 minutes (default)
CONVERSATION_DISCOVERY_CRON=*/5 * * * *

# Every 30 minutes
CONVERSATION_DISCOVERY_CRON=*/30 * * * *

# Every hour on the hour
CONVERSATION_DISCOVERY_CRON=0 * * * *

# Every 2 hours
CONVERSATION_DISCOVERY_CRON=0 */2 * * *

# Daily at midnight
CONVERSATION_DISCOVERY_CRON=0 0 * * *

# Multiple specific times (8am, 12pm, 4pm, 8pm)
CONVERSATION_DISCOVERY_CRON=0 8,12,16,20 * * *
```

**Performance Considerations**:

- **More frequent** (e.g., every 2 min) = Near real-time updates, higher CPU usage
- **Less frequent** (e.g., every 30 min) = Lower CPU usage, delayed conversation visibility
- **Recommended**: Start with default (`*/5 * * * *`) and adjust based on traffic

### ENABLE_BACKGROUND_JOBS

**Required**: No
**Default**: `true`
**Options**: `true` | `false`

Enable or disable all background jobs (currently only conversation discovery).

**When to Disable**:
- Local development (to reduce resource usage)
- Debugging (to run discovery manually)
- Testing (to control discovery timing)

**Examples**:

```bash
# Enable (production default)
ENABLE_BACKGROUND_JOBS=true

# Disable (development)
ENABLE_BACKGROUND_JOBS=false
```

**Disable for single command**:
```bash
ENABLE_BACKGROUND_JOBS=false npm run dev
```

---

## Environment-Specific Configurations

### Development (.env.local)

```bash
# Database - Local
POSTGRES_URL=postgresql://dev_user:dev_password@localhost:5432/autocrew_dev

# Auth - Local
BETTER_AUTH_SECRET=local-dev-secret-not-for-production
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Email - Local (use test account)
GMAIL_USER=dev@example.com
GMAIL_APP_PASSWORD=test-password

# n8n - Local instance
N8N_API_KEY=dev-api-key
N8N_DOCUMENT_UPLOAD_WEBHOOK=http://localhost:5678/webhook/knowledgebase/document-upload

# Background Jobs - Disabled in dev
ENABLE_BACKGROUND_JOBS=false
```

### Staging (.env.staging)

```bash
# Database - Staging
POSTGRES_URL=postgresql://staging_user:password@staging-db.example.com:5432/autocrew_staging

# Auth - Staging
BETTER_AUTH_SECRET=<generate-unique-secret>
BETTER_AUTH_URL=https://staging.yourcompany.com
NEXT_PUBLIC_APP_URL=https://staging.yourcompany.com

# Email - Production Gmail
GMAIL_USER=noreply@yourcompany.com
GMAIL_APP_PASSWORD=<production-app-password>

# n8n - Staging instance
N8N_API_KEY=<staging-api-key>
N8N_DOCUMENT_UPLOAD_WEBHOOK=https://n8n-staging.yourcompany.com/webhook/knowledgebase/document-upload

# Background Jobs - Less frequent
CONVERSATION_DISCOVERY_CRON=*/15 * * * *
ENABLE_BACKGROUND_JOBS=true
```

### Production (.env.production)

```bash
# Database - Production
POSTGRES_URL=postgresql://prod_user:password@prod-db.example.com:5432/autocrew_prod

# Auth - Production (use secrets manager)
BETTER_AUTH_SECRET=<use-secrets-manager>
BETTER_AUTH_URL=https://app.yourcompany.com
NEXT_PUBLIC_APP_URL=https://app.yourcompany.com

# Email - Production
GMAIL_USER=noreply@yourcompany.com
GMAIL_APP_PASSWORD=<use-secrets-manager>

# n8n - Production
N8N_API_KEY=<use-secrets-manager>
N8N_DOCUMENT_UPLOAD_WEBHOOK=https://n8n.yourcompany.com/webhook/knowledgebase/document-upload

# Background Jobs - Default frequency
CONVERSATION_DISCOVERY_CRON=*/5 * * * *
ENABLE_BACKGROUND_JOBS=true
```

---

## Troubleshooting

### Background Jobs Not Running

**Symptoms**: No conversation discovery happening

**Check**:
1. `ENABLE_BACKGROUND_JOBS=true` in `.env.local`
2. Server logs show `[Scheduler] Background jobs started`
3. Valid cron syntax (use [crontab.guru](https://crontab.guru))

**Solution**:
```bash
# Verify configuration
echo $ENABLE_BACKGROUND_JOBS
echo $CONVERSATION_DISCOVERY_CRON

# Check logs for scheduler initialization
npm run dev | grep Scheduler
```

### Invalid Cron Schedule

**Symptoms**: Error message about invalid cron

**Solution**: Use valid cron syntax
```bash
# Valid
CONVERSATION_DISCOVERY_CRON=*/5 * * * *

# Invalid
CONVERSATION_DISCOVERY_CRON=every 5 minutes  # ❌ Not cron syntax
```

### Secrets Exposed in Logs

**Problem**: Secrets appearing in application logs

**Solution**: Never log environment variables
```typescript
// ❌ Don't do this
console.log(process.env);

// ✅ Do this
console.log('Database connected');
```

---

## Security Best Practices

1. **Never commit `.env.local`** - Add to `.gitignore`
2. **Use secrets manager** in production (AWS Secrets Manager, Vercel Env Vars)
3. **Rotate secrets** regularly (quarterly recommended)
4. **Different secrets per environment** (dev/staging/prod)
5. **Principle of least privilege** for database users

---

## Related Documentation

- [Better Auth Setup](https://better-auth.com/docs)
- [n8n Webhook Configuration](https://docs.n8n.io/webhooks/)
- [Cron Expression Tester](https://crontab.guru)
- [Optimized Discovery System](../specs/features/optimized-conversation-discovery.md)

---

**Last Updated**: 2025-01-08
