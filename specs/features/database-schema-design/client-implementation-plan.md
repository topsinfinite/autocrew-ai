# Implementation Plan: Drizzle ORM + Client Onboarding Refactoring

## Overview

Implement a complete backend for the client data model using Drizzle ORM with local PostgreSQL. This will replace mock data with a real database while maintaining a hybrid schema that combines existing UI-friendly fields with new contact/address fields.

**Scope:** Client feature ONLY - no changes to AdminUser, CrewAssignment, Crew, Conversation, or Lead models.

---

## Hybrid Schema Structure

The final schema combines the best of both old and new fields:

```typescript
{
  // Database fields (snake_case)
  id: uuid (primary key, auto-generated)
  company_name: text (not null)
  client_code: text (unique, not null) // Auto-generated: "ACME-001"
  contact_person_name: text (not null) // Replaces old "name"
  contact_email: text (not null) // Renamed from "email"
  phone: text (nullable) // OPTIONAL
  address: text (nullable) // OPTIONAL
  city: text (nullable) // OPTIONAL
  country: text (nullable) // OPTIONAL
  plan: enum ('starter', 'professional', 'enterprise') (not null)
  status: enum ('active', 'inactive', 'trial') (not null, default 'trial')
  created_at: timestamp with time zone (not null, default now())
  updated_at: timestamp with time zone (not null, default now())
}
```

**Key Decisions:**
- ✅ Keep: `plan`, `status`, `companyName`, `updatedAt`, `createdAt` (used by UI)
- ✅ Add: `client_code`, `contact_person_name`, `phone` (optional), `address` (optional), `city` (optional), `country` (optional)
- ❌ Remove: `name` field (replaced by `contact_person_name`)
- 🔄 Rename: `email` → `contact_email`
- 🤖 Auto-generate: `client_code` from `company_name` (e.g., "Acme Corp" → "ACME-001")

---

## Implementation Phases

### Phase 1: Database Foundation (Priority 1)

**1.1 Install Dependencies**
```bash
npm install drizzle-orm postgres
npm install -D drizzle-kit tsx
```

**1.2 Create Directory Structure**
```
db/
├── index.ts           # Database connection singleton
├── schema.ts          # Table definitions + Zod schemas
├── migrate.ts         # Migration runner
├── seed.ts            # Seed with 5 mock clients
└── migrations/        # Generated SQL files (auto-created)

lib/utils/
└── client-code-generator.ts  # Auto-generate unique codes
```

**1.3 Configuration Files**

**Create: `drizzle.config.ts`** (root)
```typescript
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  schema: './db/schema.ts',
  out: './db/migrations',
  dbCredentials: {
    url: process.env.POSTGRES_URL!,
  },
  verbose: true,
  strict: true,
});
```

**Create: `db/index.ts`**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.POSTGRES_URL!;

const client = postgres(connectionString, {
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });
export { client };
```

**Create: `db/schema.ts`**
- Define `pgEnum` for plan and status
- Create `clients` table with all fields (phone, address, city, country are nullable)
- Add indexes: `client_code`, `status`, `plan`, `contact_email`
- Create Zod schemas with optional validation for phone, address, city, country:
  - `insertClientSchema` - phone/address/city/country use `.optional()` or `.nullable()`
  - `selectClientSchema` - auto-generated from table
- Export TypeScript types: `Client`, `NewClient`

**1.4 Generate and Run Migrations**
```bash
npm run db:generate  # Add script: "db:generate": "drizzle-kit generate"
npm run db:migrate   # Add script: "db:migrate": "tsx db/migrate.ts"
```

**1.5 Client Code Generator**

**Create: `lib/utils/client-code-generator.ts`**

Algorithm:
1. Extract prefix from company name (remove "Inc", "Ltd", "Corp", special chars)
2. Take first word, limit to 10 chars, uppercase
3. Query existing codes with same prefix
4. Find max number, increment, pad to 3 digits
5. Return format: `{PREFIX}-{NNN}` (e.g., "ACME-001")

Functions:
- `generateClientCode(companyName: string): Promise<string>`
- `extractPrefix(companyName: string): string`
- `isClientCodeAvailable(clientCode: string): Promise<boolean>`

**1.6 Database Seeding**

**Create: `db/seed.ts`**
- Clear existing clients
- Map 5 mock clients to new schema:
  - Acme Corp → ACME-001
  - TechStart → TECHSTART-001
  - RetailCo Ltd → RETAILCO-001
  - FinanceHub Solutions → FINANCEHUB-001
  - HealthTech → HEALTHTECH-001
- Add placeholder values for new fields (address, city, country, phone)
- Run: `npm run db:seed`

**Update `package.json` scripts:**
```json
{
  "db:generate": "drizzle-kit generate",
  "db:migrate": "tsx db/migrate.ts",
  "db:push": "drizzle-kit push",
  "db:studio": "drizzle-kit studio",
  "db:seed": "tsx db/seed.ts"
}
```

---

### Phase 2: API Routes (Priority 2)

**Create API Structure:**
```
app/api/
└── clients/
    ├── route.ts        # GET (list), POST (create)
    └── [id]/
        └── route.ts    # GET (single), PATCH (update), DELETE (delete)
```

**2.1 Create: `app/api/clients/route.ts`**

**GET /api/clients**
- Query params: `status`, `plan`, `sortBy`, `order`
- Filter by status/plan using Drizzle `where()`
- Sort by field with `orderBy()`
- Return: `{ success: true, data: Client[], count: number }`

**POST /api/clients**
- Validate body with `insertClientSchema.safeParse()`
- Auto-generate `client_code` using `generateClientCode()`
- Insert with `db.insert(clients).values(...).returning()`
- Handle unique constraint violations (409 status)
- Return: `{ success: true, data: Client, message: string }`

**2.2 Create: `app/api/clients/[id]/route.ts`**

**GET /api/clients/:id**
- Query by `id` with `eq(clients.id, params.id)`
- Return 404 if not found
- Return: `{ success: true, data: Client }`

**PATCH /api/clients/:id**
- Partial validation with `insertClientSchema.partial()`
- Update with `db.update(clients).set({ ...data, updatedAt: new Date() })`
- Return updated client

**DELETE /api/clients/:id**
- Check existence first
- Delete with `db.delete(clients).where(eq(clients.id, params.id))`
- Return: `{ success: true, message: string }`

**Error Response Format (Consistent):**
- 400: `{ success: false, error: "Validation failed", details: {...} }`
- 404: `{ success: false, error: "Client not found" }`
- 409: `{ success: false, error: "Duplicate entry" }`
- 500: `{ success: false, error: "Server error" }`

---

### Phase 3: Type System Updates (Priority 3)

**3.1 Update: `types/index.ts`**

Replace `Client` interface:
```typescript
export interface Client {
  id: string;
  companyName: string;
  clientCode: string;
  contactPersonName: string;  // Renamed from "name"
  contactEmail: string;       // Renamed from "email"
  phone?: string;             // OPTIONAL
  address?: string;           // OPTIONAL
  city?: string;              // OPTIONAL
  country?: string;           // OPTIONAL
  plan: "starter" | "professional" | "enterprise";
  status: "active" | "inactive" | "trial";
  createdAt: Date;            // Keep original naming
  updatedAt: Date;
}

export interface NewClientInput {
  companyName: string;
  contactPersonName: string;
  contactEmail: string;
  phone?: string;             // OPTIONAL
  address?: string;           // OPTIONAL
  city?: string;              // OPTIONAL
  country?: string;           // OPTIONAL
  plan: "starter" | "professional" | "enterprise";
  status?: "active" | "inactive" | "trial";
}
```

**3.2 Create: `types/api.ts`**
```typescript
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  details?: any;
}
```

**3.3 Create: `lib/api/clients.ts`** (API helper functions)
- `getClients(params?: { status?, plan? }): Promise<Client[]>`
- `getClientById(id: string): Promise<Client | null>`
- `createClient(data: NewClientInput): Promise<Client>`
- `updateClient(id: string, data: Partial<NewClientInput>): Promise<Client>`
- `deleteClient(id: string): Promise<void>`

---

### Phase 4: UI Refactoring (Priority 4)

**4.1 Update: `components/admin/client-onboarding-form.tsx`**

**Changes:**
1. Add new form fields:
   - Replace `adminName` → `contactPersonName`
   - Replace `adminEmail` → `contactEmail`
   - Add: `phone` (optional), `address` (optional), `city` (optional), `country` (optional)

2. Form state:
```typescript
const [formData, setFormData] = useState({
  companyName: "",
  contactPersonName: "",
  contactEmail: "",
  phone: "",        // Optional - not required
  address: "",      // Optional - not required
  city: "",         // Optional - not required
  country: "",      // Optional - not required
  plan: "",
});
const [isSubmitting, setIsSubmitting] = useState(false);
const [error, setError] = useState<string | null>(null);
```

3. API integration:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);

  try {
    const response = await fetch('/api/clients', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Failed to create client');
    }

    alert(`Client created! Code: ${result.data.clientCode}`);
    setOpen(false);
    window.location.reload(); // Refresh client list
  } catch (err) {
    setError(err.message);
  } finally {
    setIsSubmitting(false);
  }
};
```

4. Form layout:
- Section 1: Company Information (`companyName` - required)
- Section 2: Contact Information (`contactPersonName` - required, `contactEmail` - required, `phone` - optional)
- Section 3: Address Information (`address` - optional, `city` - optional, `country` - optional in grid)
- Section 4: Plan Selection (`plan` - required)
- Error display area
- Submit button with loading state
- Note: Remove `required` attribute from phone, address, city, country input fields

**4.2 Update: `app/(admin)/admin/clients/page.tsx`**

**Option A: Server Component (Recommended)**
```typescript
export default async function ClientsPage() {
  const response = await fetch('http://localhost:3000/api/clients', {
    cache: 'no-store',
  });
  const result = await response.json();
  const clients = result.data || [];

  // Render table...
}
```

**Option B: Client Component with SWR**
```typescript
'use client';
import useSWR from 'swr';

const { data, isLoading } = useSWR('/api/clients', fetcher);
```

**Table Updates:**
- Replace `client.name` → `client.contactPersonName`
- Replace `client.email` → `client.contactEmail`
- Add `client.clientCode` column (after company name)
- Keep `createdAt` as is (no rename)

**4.3 Update: `app/(admin)/admin/clients/[id]/page.tsx`**

**Fetch from API:**
```typescript
export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
  const response = await fetch(`http://localhost:3000/api/clients/${params.id}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    notFound();
  }

  const result = await response.json();
  const client = result.data;

  // Render details...
}
```

**Display Updates:**
- Add prominent `clientCode` badge
- Show `contactPersonName`, `contactEmail`, `phone` (if provided)
- Add Address section: `address`, `city`, `country` (show "N/A" if optional fields are null)
- Update field labels
- Handle optional fields gracefully in UI

**4.4 Update: `components/admin/client-overview-card.tsx`**
- Replace `client.name` → `client.contactPersonName`
- Add `client.clientCode` display

---

### Phase 5: Testing & Verification (Priority 5)

**5.1 Database Verification**
```bash
# Connect to PostgreSQL
psql postgresql://dev_user:dev_password@localhost:5532/postgres_dev

# Verify table structure
\d clients

# Check seeded data
SELECT id, company_name, client_code, status, plan FROM clients;

# Test unique constraint
# Try inserting duplicate client_code - should fail
```

**5.2 API Testing**
```bash
# List all clients
curl http://localhost:3000/api/clients

# Filter by status
curl http://localhost:3000/api/clients?status=active

# Get single client
curl http://localhost:3000/api/clients/{uuid}

# Create client (with all fields)
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "contactPersonName": "Jane Doe",
    "contactEmail": "jane@test.com",
    "phone": "+1234567890",
    "address": "123 Test St",
    "city": "Test City",
    "country": "USA",
    "plan": "starter"
  }'

# Create client (minimal - without optional fields)
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Minimal Company",
    "contactPersonName": "John Smith",
    "contactEmail": "john@minimal.com",
    "plan": "starter"
  }'

# Update client
curl -X PATCH http://localhost:3000/api/clients/{uuid} \
  -H "Content-Type: application/json" \
  -d '{"status": "active"}'

# Delete client
curl -X DELETE http://localhost:3000/api/clients/{uuid}
```

**5.3 UI Testing Checklist**
- [ ] Navigate to `/admin/clients` - verify all clients display
- [ ] Click "Onboard Client" - verify form has all new fields
- [ ] Fill out form completely - verify validation works
- [ ] Submit form - verify success message shows client code
- [ ] Refresh page - verify new client appears in list
- [ ] Click "View" on a client - verify all fields display correctly
- [ ] Test form validation (empty fields, invalid email)
- [ ] Test error handling (network error)
- [ ] Verify client code generation (create multiple with same prefix)
- [ ] Verify plan/status badges still work correctly

**5.4 Client Code Generation Testing**
- Create "Acme Corp" → Should get "ACME-001"
- Create "Acme Corporation" → Should get "ACME-002"
- Create "TechStart Solutions" → Should get "TECHSTART-001"
- Create "ABC" → Should get "ABC-001"

---

## Critical Files Summary

### Files to Create (13 new files)
1. `drizzle.config.ts` - Drizzle configuration
2. `db/index.ts` - Database connection
3. `db/schema.ts` - Table definitions + Zod schemas
4. `db/migrate.ts` - Migration runner
5. `db/seed.ts` - Database seeding
6. `lib/utils/client-code-generator.ts` - Code generation logic
7. `app/api/clients/route.ts` - List + Create endpoints
8. `app/api/clients/[id]/route.ts` - Get + Update + Delete endpoints
9. `types/api.ts` - API response types
10. `lib/api/clients.ts` - API helper functions
11. `db/migrations/0000_*.sql` - Generated migration (auto)
12. `db/migrations/meta/_journal.json` - Migration journal (auto)
13. `db/migrations/meta/0000_snapshot.json` - Schema snapshot (auto)

### Files to Modify (4 existing files)
1. `types/index.ts` - Update Client interface
2. `components/admin/client-onboarding-form.tsx` - Add fields + API integration
3. `app/(admin)/admin/clients/page.tsx` - Fetch from API
4. `app/(admin)/admin/clients/[id]/page.tsx` - Fetch from API + display new fields

### Files to Update (1 config file)
1. `package.json` - Add dependencies + scripts

---

## Success Criteria

✅ **Database Setup**
- PostgreSQL connection working
- Clients table created with all fields
- Enums created for plan and status
- Indexes created for performance
- 5 mock clients seeded with auto-generated codes

✅ **API Functionality**
- All 5 endpoints working (GET list, POST, GET single, PATCH, DELETE)
- Validation working with proper error messages
- Client code auto-generation working
- Unique constraint preventing duplicates

✅ **Type Safety**
- TypeScript types updated across entire app
- No type errors in IDE
- Drizzle schema types match TypeScript interfaces

✅ **UI Integration**
- Onboarding form has all new fields
- Form submits to API successfully
- Client list displays data from database
- Client detail page shows all fields
- All UI components work without mock data
- Error handling shows user-friendly messages

✅ **Data Integrity**
- No mock data imports in components
- All client data comes from database
- Client codes are unique and sequential
- Plan/status badges still work correctly

---

## Rollback Strategy

If critical issues arise:

1. **Revert UI changes:**
```bash
git checkout HEAD -- components/admin/client-onboarding-form.tsx
git checkout HEAD -- app/(admin)/admin/clients/
```

2. **Drop database tables:**
```sql
DROP TABLE IF EXISTS clients CASCADE;
DROP TYPE IF EXISTS plan CASCADE;
DROP TYPE IF EXISTS status CASCADE;
```

3. **Remove new files:**
```bash
rm -rf db/
rm -rf app/api/
rm drizzle.config.ts
```

4. **Restore dependencies:**
```bash
npm uninstall drizzle-orm postgres drizzle-kit tsx
```

---

## Estimated Timeline

- **Phase 1 (Database Foundation):** 3-4 hours
- **Phase 2 (API Routes):** 2-3 hours
- **Phase 3 (Type System):** 1 hour
- **Phase 4 (UI Refactoring):** 3-4 hours
- **Phase 5 (Testing):** 2 hours

**Total:** 11-14 hours of focused development

---

## Notes

- This plan focuses ONLY on the client data model
- AdminUser, CrewAssignment, and other models are NOT touched
- The hybrid schema preserves all UI functionality while adding new fields
- Client code generation ensures unique, readable identifiers
- All API routes include proper validation and error handling
- Type safety is maintained throughout the entire stack
