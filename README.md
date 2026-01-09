# AutoCrew SaaS Platform

A B2B digital labor platform that allows small businesses to manage "Agentic Crews" powered by n8n workflows.

## Design Language

**Professional, Industrious, High-Trust**
- **Dark Mode Primary Theme**: Professional slate tones for an industrious feel
- **Cyan/Teal Primary** (#16A085): Main CTAs and interactive elements
- **Cyber Blue** (#0EA5E9): Secondary accent for information and status
- **Empty State First**: Thoughtfully designed empty states guide new users through setup

## Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), TypeScript, React 19
- **Styling**: Tailwind CSS v4, Shadcn UI (New York style)
- **Authentication**: Better Auth with organization plugin (multi-tenant)
- **Database**: Supabase PostgreSQL
- **ORM**: Drizzle ORM with migrations
- **Agentic Logic**: n8n workflows (external webhooks)
- **Charts**: Recharts for data visualization

## Architecture

### Multi-Tenant Design

The platform supports two user roles:
- **Super Admin**: Platform-wide access, can manage all clients and create client admins
- **Client Admin**: Organization-scoped access, can only view/manage their own organization's data

**Data Isolation:**
- All data models include `clientId` for tenant separation
- Middleware enforces route protection
- API routes validate authorization before queries
- Data Access Layer (DAL) with React.cache() optimization

### Project Structure

```
├── app/
│   ├── (public)/              # Public routes (login, signup, landing)
│   │   ├── login/
│   │   ├── signup/
│   │   ├── forgot-password/
│   │   └── contact-support/
│   ├── (dashboard)/           # Protected dashboard routes
│   │   ├── dashboard/         # Main dashboard
│   │   ├── analytics/         # Analytics & insights
│   │   ├── conversations/     # Conversation history
│   │   ├── crews/             # Crew management
│   │   ├── settings/          # User settings
│   │   └── layout.tsx         # Dashboard layout with sidebar
│   ├── (admin)/               # Super admin routes
│   │   └── admin/
│   │       ├── clients/       # Client management
│   │       ├── users/         # User management
│   │       └── crews/         # All crews overview
│   ├── api/                   # API routes
│   │   ├── auth/              # Better Auth endpoints
│   │   ├── clients/           # Client CRUD
│   │   ├── crews/             # Crew CRUD & knowledge base
│   │   ├── conversations/     # Conversation queries
│   │   └── admin/             # Admin operations
│   └── docs/                  # Documentation pages
├── components/
│   ├── ui/                    # Shadcn UI components (auto-generated)
│   ├── admin/                 # Admin-specific components
│   ├── crews/                 # Crew management components
│   ├── layout/                # Layout components
│   └── providers/             # Context providers
├── lib/
│   ├── auth.ts                # Better Auth server config
│   ├── auth-client.ts         # Better Auth client hooks
│   ├── auth/                  # Auth utilities & session helpers
│   ├── api/                   # API client functions
│   ├── db/                    # Database query functions
│   ├── utils/                 # Utility functions (organized)
│   │   ├── generators/        # Code/slug generators
│   │   ├── crew/              # Crew provisioning
│   │   ├── transformers/      # Data transformers
│   │   ├── validators/        # Input validators
│   │   └── database/          # DB maintenance
│   ├── validations/           # Zod validation schemas
│   ├── constants/             # Shared constants
│   ├── contexts/              # React contexts
│   ├── hooks/                 # Custom React hooks
│   └── services/              # Business logic services
├── db/
│   ├── schema.ts              # Drizzle schema definitions
│   ├── migrations/            # SQL migration files
│   ├── seed.ts                # Database seeding script
│   └── index.ts               # Database client
├── types/                     # TypeScript type definitions
│   ├── index.ts               # Barrel export
│   ├── auth.ts                # Auth types
│   ├── client.ts              # Client types
│   ├── crew.ts                # Crew types
│   ├── conversation.ts        # Conversation types
│   ├── knowledge-base.ts      # Knowledge base types
│   └── ...                    # Other domain types
└── middleware.ts              # Route protection
```

## Features

### Multi-Tenant Client Management (Super Admin)
- Create and manage client organizations
- Automatic organization creation in Better Auth
- Generate unique client codes and slugs
- Assign client admins to organizations
- Track client status and subscription plans

### User Management
- Better Auth integration with email/password
- Organization-based multi-tenancy
- Role-based access control (Super Admin / Client Admin)
- Secure password requirements (8+ chars, uppercase, lowercase, number, special char)
- Password reset flow via email

### Crew Management
- Provision crews with dynamic database tables
- Support for Customer Support and Lead Generation crew types
- n8n webhook integration
- Knowledge base document upload (PDF, DOCX, TXT, MD, CSV, XLSX)
- Vector database storage for RAG
- Automatic table creation and cleanup

### Conversation Discovery
- Background job to discover conversations from crew histories tables
- Automatic metadata extraction (sentiment, duration, customer email)
- Multi-crew conversation aggregation per client
- Optimized queries with proper indexing

### Analytics & Insights
- Interactive date range filtering
- Conversation volume trends
- Lead generation metrics
- Sentiment analysis
- Real-time KPIs

### Knowledge Base (Customer Support Crews)
- Document upload to crew-specific vector stores
- Automatic chunking and embedding via n8n
- Document status tracking (processing, indexed, error)
- Fast metadata queries (no vector table scanning)
- Atomic transactions with rollback on failure

## Getting Started

### Prerequisites

- Node.js 18.17.0 or higher
- npm 9.0.0 or higher
- PostgreSQL database (Supabase recommended)
- n8n instance with configured workflows

### Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
POSTGRES_URL=postgresql://user:password@host:port/database

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# n8n Integration
N8N_API_KEY=your-n8n-api-key
N8N_DOCUMENT_UPLOAD_WEBHOOK=https://your-n8n-instance.com/webhook/document-upload

# Email (for Better Auth)
EMAIL_FROM=noreply@yourdomain.com
EMAIL_SERVER_HOST=smtp.example.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-smtp-user
EMAIL_SERVER_PASSWORD=your-smtp-password
```

### Installation

1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd AutoCrew-SaaS
npm install
```

2. Set up the database:
```bash
# Run migrations
npm run db:migrate

# Seed initial data (creates super admin + test clients)
npm run db:seed
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

**Default Super Admin Credentials:**
- Email: `admin@autocrew.ai`
- Password: `Admin123!@#`

### Build for Production

```bash
npm run build
npm start
```

## Database Schema

### Authentication Tables (Better Auth)
- `user` - User accounts with role field
- `session` - Active user sessions
- `account` - OAuth accounts (future)
- `verification` - Email verification tokens
- `member` - Organization membership (for multi-tenant filtering)

### Core Tables
- `clients` - Client organizations (mapped to Better Auth organizations)
- `crews` - AI crews with dynamic table references
- `conversations` - Indexed conversation metadata
- `knowledge_base_documents` - Document metadata for knowledge bases

### Dynamic Tables (per crew)
- `{client}_{type}_vector_{seq}` - Vector embeddings for RAG
- `{client}_{type}_histories_{seq}` - Conversation histories

## Available Scripts

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run typecheck` - Run TypeScript compiler check

### Database
- `npm run db:generate` - Generate new migration from schema changes
- `npm run db:migrate` - Apply migrations to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Code Quality
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run validate` - Run typecheck + lint + format check

### Testing
- `npm run test` - Run all tests with Jest
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report
- `npm run test:ci` - Run tests in CI mode (for CI/CD)

## Testing

The project uses **Jest 30** and **React Testing Library 16** for comprehensive unit and integration testing.

### Test Structure

```
__tests__/
├── test-utils.ts              # Mock data factories and helpers
├── lib/
│   ├── utils/                 # Utility function tests
│   └── validations/           # Zod schema tests
└── components/                # React component tests
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode (auto-rerun on changes)
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Current Coverage

- ✅ **Utility Functions**: Slug generation, file validation
- ✅ **Validation Schemas**: Authentication, client management
- ✅ **Components**: Empty state component
- ⏳ **API Routes**: Planned
- ⏳ **Database Operations**: Planned

All tests use mock data factories from `__tests__/test-utils.ts` for consistency. See `CLAUDE.md` for detailed testing guidelines and examples.

## API Routes

### Public Routes
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/reset-password` - Password reset

### Protected Routes
- `GET /api/clients` - List clients (SuperAdmin only)
- `POST /api/clients` - Create client (SuperAdmin only)
- `GET /api/clients/:id` - Get client details
- `DELETE /api/clients/:id` - Delete client (SuperAdmin only)

- `GET /api/crews` - List crews (filtered by role)
- `POST /api/crews` - Create crew
- `GET /api/crews/:id` - Get crew details
- `PATCH /api/crews/:id` - Update crew
- `DELETE /api/crews/:id` - Delete crew

- `POST /api/crews/:id/knowledge-base` - Upload document
- `GET /api/crews/:id/knowledge-base` - List documents
- `DELETE /api/crews/:id/knowledge-base/:docId` - Delete document

- `GET /api/conversations` - List conversations (filtered by client)
- `GET /api/conversations/:id` - Get conversation with transcript

## Troubleshooting

### Build Issues

**Error: "Module not found: Can't resolve 'fs'"**
- This usually means a server-only module is being imported by a client component
- Check that database utilities are not exported in barrel exports
- Import server utilities directly: `import { provisionCrew } from '@/lib/utils/crew'`

**Error: "Dynamic server usage: Route couldn't be rendered statically"**
- This is expected for routes using `headers()` or `cookies()`
- These routes will be server-rendered on demand (marked with ƒ in build output)

### Database Issues

**Migration fails**
```bash
# Reset database and start fresh
npm run db:generate
npm run db:migrate
npm run db:seed
```

**Orphaned tables after crew deletion**
```bash
# Run cleanup script (to be implemented)
npm run db:cleanup
```

### Authentication Issues

**"Unauthorized" errors after login**
- Check that `BETTER_AUTH_SECRET` is set in `.env.local`
- Verify session cookie is being set (check browser dev tools)
- Ensure middleware is not blocking the route

**Email not sending**
- Verify EMAIL_SERVER_* environment variables are correct
- Check SMTP credentials and server accessibility
- Review logs for detailed error messages

### n8n Integration Issues

**Document upload fails**
- Verify `N8N_API_KEY` and `N8N_DOCUMENT_UPLOAD_WEBHOOK` are correct
- Check n8n webhook is active and accessible
- Review n8n workflow logs for errors
- Ensure file size is under 10MB and type is supported

## Contributing

1. Follow the existing code style and patterns
2. Run `npm run validate` before committing
3. Ensure all tests pass (when implemented)
4. Update documentation for new features

## License

ISC
