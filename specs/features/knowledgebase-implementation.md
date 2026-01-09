# Knowledge Base Management & Multi-Step Crew Activation Plan

## Overview
Transform the support crew activation flow into a multi-step wizard with knowledge base document upload, review, and deletion capabilities. Documents are uploaded to n8n for processing and stored in the existing vector tables.

---

## Architecture Design

### Core Strategy
- **No File Storage**: Documents sent directly to n8n as binary via multipart/form-data
- **N8N Processing**: n8n handles parsing, chunking, embedding (OpenAI text-embedding-3-small), and PGVector insertion
- **API Key Authentication**: X-API-Key header required for n8n webhook
- **Vector Table Queries**: Read from existing `crew.config.vectorTableName` to list/delete documents
- **Multi-Step Wizard**: Replace single-toggle activation with 3-step wizard for customer_support crews

### Document Flow
1. Client admin uploads document (PDF, TXT, MD, CSV, DOCX)
2. Frontend sends file via multipart/form-data to `/api/crews/[id]/knowledge-base`
3. API validates → constructs FormData with crewCode + binary file → POSTs to n8n webhook
4. N8N validates API key → queries crews table → extracts vector table name
5. N8N processes document → generates embeddings → inserts chunks into PGVector table
6. Frontend queries vector table → displays documents (n8n stores filename in metadata)

---

## Implementation Phases

### Phase 1: Type Definitions & Utilities

#### 1.1 Add Types to `/types/index.ts`

**New Interfaces:**
```typescript
// Knowledge Base Document (from vector table queries)
export interface KnowledgeBaseDocument {
  docId: string;           // Unique identifier for grouped chunks
  filename: string;        // Original filename
  fileType: string;        // MIME type or extension
  uploadedAt: Date;        // Upload timestamp
  chunkCount: number;      // Number of chunks in vector table
  metadata?: {
    fileSize?: number;     // Original file size in bytes
    [key: string]: unknown;
  };
}

// N8N webhook success response (from actual workflow)
export interface N8nUploadResponse {
  status: 'success' | 'error';
  message: string;
  statusCode?: number;     // For error responses
  metadata?: {
    crew_code: string;
    client_id: string;
    vector_table: string;
    timestamp: string;
  };
  document?: {
    status: 'indexed';
    embeddings_model: 'text-embedding-3-small';
  };
}

// Vector table row structure (based on crew provisioning pattern)
export interface VectorTableRow {
  id: string;
  content: string;         // Text chunk
  embedding: number[];     // Vector embedding
  metadata: {
    docId: string;         // Groups chunks from same document
    filename: string;
    fileType: string;
    uploadedAt: string;
    chunkIndex?: number;
    [key: string]: unknown;
  };
  created_at: Date;
}

// Activation wizard step state
export interface CrewActivationState {
  documentsUploaded: boolean;
  supportConfigured: boolean;
  activationReady: boolean;
}
```

**Update CrewConfig:**
```typescript
export interface CrewConfig {
  vectorTableName?: string;
  historiesTableName?: string;
  metadata?: {
    support_email?: string;
    support_client_name?: string;
    [key: string]: unknown;
  };
  activationState?: CrewActivationState;  // NEW: Track wizard completion
}
```

#### 1.2 Create File Validation Utility

**File:** `/lib/utils/file-validator.ts` (NEW)

```typescript
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
  'text/plain',
  'text/markdown',
  'text/csv',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function validateFile(file: File): { valid: boolean; error?: string }
export function getFileExtension(filename: string): string
```

**Key Functions:**
- File validation (type, size)
- MIME type detection
- File extension extraction

**Note:** No base64 encoding needed - files sent as binary via multipart/form-data

---

### Phase 2: Backend API Routes

#### 2.1 Knowledge Base Upload Endpoint

**File:** `/app/api/crews/[id]/knowledge-base/route.ts` (NEW)

**POST /api/crews/:id/knowledge-base**

Request: **multipart/form-data**
```typescript
FormData:
  file: File  // Binary file data
```

Implementation steps:
1. `await requireAuth()` - verify session
2. Parse multipart form data (use Next.js request.formData())
3. Fetch crew by id, check it exists and is `customer_support` type
4. Authorization check:
   - If SuperAdmin: allow
   - If Client Admin: verify membership via `member` table join
5. Validate file (type, size using file-validator utility)
6. Construct FormData for n8n:
   ```typescript
   const formData = new FormData();
   formData.append('crewCode', crew.crewCode);
   formData.append('file', fileBlob, filename);
   ```
7. POST to n8n webhook URL with:
   - Headers: `{ 'X-API-Key': process.env.N8N_API_KEY }`
   - Body: FormData
   - Timeout: 60s (document processing can take time)
8. Handle n8n response (see Phase 5 for response structure):
   - Success: Extract metadata, return success
   - Error: Parse error message and statusCode
9. Update `crew.config.activationState.documentsUploaded = true` if first upload

Response:
```typescript
{
  success: true,
  data: {
    filename: string;
    vectorTable: string;
    status: 'indexed';
    embeddingsModel: string;
  },
  message: 'Document uploaded and processed successfully'
}
```

**GET /api/crews/:id/knowledge-base**

Query params: none

Implementation steps:
1. `await requireAuth()` + authorization check (same as POST)
2. Fetch crew, verify customer_support type
3. Get `vectorTableName` from `crew.config.vectorTableName`
4. Query vector table with SQL (using Drizzle's `db.execute()`):
   ```sql
   SELECT
     metadata->>'docId' as doc_id,
     metadata->>'filename' as filename,
     metadata->>'fileType' as file_type,
     MIN(created_at) as uploaded_at,
     COUNT(*) as chunk_count,
     metadata->>'fileSize' as file_size
   FROM {vectorTableName}
   GROUP BY doc_id, filename, file_type, file_size
   ORDER BY uploaded_at DESC
   ```
5. Transform rows to `KnowledgeBaseDocument[]`
6. Return documents array

Response:
```typescript
{
  success: true,
  data: KnowledgeBaseDocument[],
  count: number
}
```

#### 2.2 Knowledge Base Delete Endpoint

**File:** `/app/api/crews/[id]/knowledge-base/[docId]/route.ts` (NEW)

**DELETE /api/crews/:id/knowledge-base/:docId**

Implementation steps:
1. `await requireAuth()` + authorization check
2. Fetch crew, verify customer_support type
3. Get `vectorTableName` from config
4. Delete all chunks with matching docId:
   ```sql
   DELETE FROM {vectorTableName}
   WHERE metadata->>'docId' = $1
   RETURNING id
   ```
5. Return deleted count
6. Optionally: notify n8n of deletion (POST to webhook with delete event)

Response:
```typescript
{
  success: true,
  data: {
    deletedChunks: number;
  },
  message: 'Document deleted successfully'
}
```

#### 2.3 Client-Side API Helpers

**File:** `/lib/api/knowledge-base.ts` (NEW)

```typescript
export async function uploadDocument(
  crewId: string,
  file: File
): Promise<{ success: boolean; data?: any; error?: string }> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`/api/crews/${crewId}/knowledge-base`, {
    method: 'POST',
    body: formData, // Don't set Content-Type - browser sets it with boundary
  });

  return response.json();
}

export async function getKnowledgeBaseDocuments(
  crewId: string
): Promise<{ success: boolean; data?: KnowledgeBaseDocument[]; error?: string }>

export async function deleteKnowledgeBaseDocument(
  crewId: string,
  docId: string
): Promise<{ success: boolean; error?: string }>
```

---

### Phase 3: UI Components

#### 3.1 File Upload Component

**File:** `/components/crews/knowledge-base-upload.tsx` (NEW)

Features:
- Drag-and-drop zone (use `react-dropzone` or native events)
- File picker button
- File type/size validation before upload
- Upload progress indicator per file
- Multiple file support with upload queue
- Error display for failed uploads
- Success feedback with file list

Props:
```typescript
interface KnowledgeBaseUploadProps {
  crewId: string;
  onUploadSuccess: (doc: KnowledgeBaseDocument) => void;
  onUploadError: (error: string) => void;
}
```

#### 3.2 Knowledge Base Document List

**File:** `/components/crews/knowledge-base-list.tsx` (NEW)

Features:
- Table display with columns: Filename, Type, Upload Date, Chunks, Size, Actions
- Delete button with confirmation dialog
- Empty state when no documents
- Loading state during fetch/delete
- Refresh capability

Props:
```typescript
interface KnowledgeBaseListProps {
  crewId: string;
  documents: KnowledgeBaseDocument[];
  onDelete: (docId: string) => void;
  onRefresh: () => void;
  isLoading?: boolean;
}
```

#### 3.3 Multi-Step Activation Wizard

**File:** `/components/crews/activation-wizard.tsx` (NEW)

**Structure:**
```tsx
<Dialog> {/* Full-screen or large modal */}
  <WizardStepper currentStep={step} steps={3} />

  {step === 1 && (
    <Step1UploadKnowledgeBase>
      <KnowledgeBaseUpload />
      <KnowledgeBaseList />
      <Button onClick={nextStep}>Continue to Configuration</Button>
    </Step1UploadKnowledgeBase>
  )}

  {step === 2 && (
    <Step2ConfigureSupport>
      {/* Existing support email & client name form */}
      <Button onClick={prevStep}>Back</Button>
      <Button onClick={nextStep}>Review & Activate</Button>
    </Step2ConfigureSupport>
  )}

  {step === 3 && (
    <Step3ReviewActivate>
      {/* Summary of uploaded docs and config */}
      <Button onClick={prevStep}>Back</Button>
      <Button onClick={handleActivate}>Activate Crew</Button>
    </Step3ReviewActivate>
  )}
</Dialog>
```

State Management:
```typescript
const [currentStep, setCurrentStep] = useState(1);
const [documents, setDocuments] = useState<KnowledgeBaseDocument[]>([]);
const [supportEmail, setSupportEmail] = useState('');
const [supportClientName, setSupportClientName] = useState('');
```

Step Validation:
- Step 1: Allow continue even with 0 documents (optional)
- Step 2: Require valid email and non-empty client name
- Step 3: Display summary, activate crew on confirm

Props:
```typescript
interface ActivationWizardProps {
  crew: Crew;
  isOpen: boolean;
  onClose: () => void;
  onActivationComplete: (crew: Crew) => void;
}
```

#### 3.4 Wizard Stepper Component

**File:** `/components/crews/wizard-stepper.tsx` (NEW)

Visual stepper indicator showing:
- Step numbers (1, 2, 3)
- Step titles ("Upload Knowledge Base", "Configure Support", "Review & Activate")
- Active/completed/incomplete states
- Progress line between steps

Uses Tailwind for styling, similar to existing UI patterns.

---

### Phase 4: Integration with Crews Page

**File:** `/app/(dashboard)/crews/page.tsx` (MODIFY)

**Changes:**

1. **Import new components:**
   ```typescript
   import { ActivationWizard } from '@/components/crews/activation-wizard';
   ```

2. **Add state for wizard:**
   ```typescript
   const [isWizardOpen, setIsWizardOpen] = useState(false);
   const [selectedCrewForWizard, setSelectedCrewForWizard] = useState<Crew | null>(null);
   ```

3. **Modify `handleToggleStatus` function (around line 88):**
   ```typescript
   const handleToggleStatus = async (crew: Crew) => {
     const newStatus = crew.status === "active" ? "inactive" : "active";

     // FOR CUSTOMER SUPPORT ACTIVATION: Use wizard
     if (newStatus === "active" && crew.type === "customer_support") {
       setSelectedCrewForWizard(crew);
       setIsWizardOpen(true);
       return; // Don't proceed with direct toggle
     }

     // FOR DEACTIVATION or LEAD GEN: Direct toggle
     try {
       const updatedCrew = await updateCrew(crew.id, { status: newStatus });
       setCrews(crews.map(c => c.id === crew.id ? updatedCrew : c));

       if (newStatus === "active") {
         // Show integration dialog for lead_generation
         setSelectedCrew(updatedCrew);
         setIsIntegrationOpen(true);
       }
     } catch (err) {
       setError('Failed to update crew status');
     }
   };
   ```

4. **Add wizard component to JSX (around line 800):**
   ```tsx
   {selectedCrewForWizard && (
     <ActivationWizard
       crew={selectedCrewForWizard}
       isOpen={isWizardOpen}
       onClose={() => {
         setIsWizardOpen(false);
         setSelectedCrewForWizard(null);
       }}
       onActivationComplete={(updatedCrew) => {
         setCrews(crews.map(c => c.id === updatedCrew.id ? updatedCrew : c));
         setIsWizardOpen(false);
         setSelectedCrewForWizard(null);
         // Optionally show integration dialog after activation
         setSelectedCrew(updatedCrew);
         setIsIntegrationOpen(true);
       }}
     />
   )}
   ```

5. **Keep existing config dialog for editing** (don't remove):
   - Allow editing support email/client name after activation
   - Triggered by "Set/Edit Support" button in actions column

---

### Phase 5: N8N Webhook Integration

**N8N Workflow Actual Implementation (from provided JSON):**

#### Request to N8N
**Method:** POST
**URL:** `{crew.webhookUrl}` (e.g., `http://localhost:5678/webhook/document-upload`)
**Headers:**
```
X-API-Key: {process.env.N8N_API_KEY}
Content-Type: multipart/form-data
```

**Body (FormData):**
```
crewCode: "ACME-001-SUP-001"
file: <binary file data>
```

#### N8N Workflow Processing Steps

1. **Webhook Trigger** - Receives POST request
2. **Validate API Key** - Checks X-API-Key header matches expected value
3. **Select Crew** - Queries `crews` table by `crew_code` to get crew record
4. **Check Crew Exists** - Returns 404 error if crew not found
5. **Extract Metadata** - Gets `client_id`, `crew_code`, `vec_table` from crew.config
6. **Document Loader** - Loads binary file, parses content (PDF, DOCX, TXT, etc.)
7. **Generate Embeddings** - OpenAI text-embedding-3-small model
8. **Insert to PGVector** - Inserts chunks into vector table specified in crew config
9. **Format Response** - Returns success with metadata

#### N8N Success Response
```json
{
  "status": "success",
  "message": "Document uploaded and processed successfully",
  "metadata": {
    "crew_code": "ACME-001-SUP-001",
    "client_id": "ACME-001",
    "vector_table": "vec_acme_001_sup_001",
    "timestamp": "2026-01-05T10:30:00.000Z"
  },
  "document": {
    "status": "indexed",
    "embeddings_model": "text-embedding-3-small"
  }
}
```

#### N8N Error Responses

**Invalid/Missing API Key (401/403):**
```json
{
  "status": "error",
  "message": "Missing X-API-Key header" | "Invalid API key",
  "statusCode": 401 | 403
}
```

**Crew Not Found (404):**
```json
{
  "status": "error",
  "message": "Crew code not found in database",
  "statusCode": 404
}
```

#### Environment Variable Required
Add to `.env.local`:
```
N8N_API_KEY=your-secure-api-key-here
```

**IMPORTANT:** The API key must match the value hardcoded in the n8n workflow's "Validate API Key" node.

#### Frontend Error Handling
- **401/403**: "Authentication failed - invalid API key configuration"
- **404**: "Crew not found - please refresh and try again"
- **408 Timeout**: "Document processing timeout - file may be too large or complex"
- **500**: "n8n webhook error - please contact support"
- **Network Error**: "Unable to connect to document processing service"

#### Frontend Success Flow
1. Show processing spinner: "Processing document with AI embeddings..."
2. On success: "Document indexed successfully in {vectorTable}"
3. Refresh document list to show new upload
4. Display metadata: embeddings model, timestamp

---

## Critical Files Summary

### Files to Create (NEW)
1. `/types/index.ts` - Add document types, N8nUploadResponse, extend CrewConfig ✓
2. `/lib/utils/file-validator.ts` - File validation (type, size, extension) ✓
3. `/app/api/crews/[id]/knowledge-base/route.ts` - Upload (POST multipart) and List (GET) ✓
4. `/app/api/crews/[id]/knowledge-base/[docId]/route.ts` - Delete (DELETE) ✓
5. `/lib/api/knowledge-base.ts` - Client-side API helpers with FormData ✓
6. `/components/crews/knowledge-base-upload.tsx` - File upload UI ✓
7. `/components/crews/knowledge-base-list.tsx` - Document list table ✓
8. `/components/crews/activation-wizard.tsx` - Multi-step wizard ✓
9. `/components/crews/wizard-stepper.tsx` - Stepper indicator ✓

### Environment Variables to Add
1. `.env.local` - Add `N8N_API_KEY=your-secure-api-key-here` ✓

### Files to Modify (EDIT)
1. `/app/(dashboard)/crews/page.tsx` - Integrate wizard for customer_support activation ✓

---

## NPM Dependencies

**Required:**
None - using native FormData and File APIs

**Optional (for enhanced file upload UX):**
```bash
npm install react-dropzone
npm install --save-dev @types/react-dropzone
```

---

## Testing Checklist

### Backend Testing
- [ ] Upload document to valid crew (Client Admin)
- [ ] Upload document with invalid file type (should reject)
- [ ] Upload document > 10MB (should reject)
- [ ] Upload as Client Admin to crew from another org (should 403)
- [ ] List documents from crew with vector table
- [ ] List documents from crew without vector table (should 400)
- [ ] Delete document by docId (verify all chunks removed)
- [ ] Delete non-existent docId (should 404)

### Frontend Testing
- [ ] Open wizard on customer_support crew activation attempt
- [ ] Upload single document (drag-and-drop)
- [ ] Upload multiple documents (file picker)
- [ ] View uploaded documents in list
- [ ] Delete document with confirmation
- [ ] Navigate: Step 1 → Step 2 → Step 3 → Back to Step 2
- [ ] Configure support email/name in Step 2
- [ ] Review summary in Step 3
- [ ] Activate crew from wizard (verify status changes)
- [ ] Deactivate active crew (direct toggle, no wizard)
- [ ] Activate lead_generation crew (direct toggle, no wizard)
- [ ] Edit support config after activation (existing dialog)

### N8N Integration Testing
- [ ] Upload triggers n8n webhook POST
- [ ] N8N successfully processes document and returns chunk count
- [ ] N8N error response displays error message
- [ ] N8N timeout (30s+) shows timeout error
- [ ] Verify vector table contains inserted chunks with correct metadata
- [ ] Verify docId groups chunks correctly
- [ ] Query knowledge base displays all uploaded documents

---

## Edge Cases & Considerations

### 1. Wizard State Persistence
- **Problem:** User closes wizard mid-flow, loses progress
- **Solution:** Store wizard state in `crew.config.activationState` (optional)
- **Alternative:** Accept that closing loses progress (simpler)

### 2. Concurrent Uploads
- **Problem:** Multiple users uploading to same crew simultaneously
- **Solution:** Each upload has unique `docId`, no conflicts in vector table

### 3. N8N Webhook Failure Recovery
- **Problem:** Upload fails, user doesn't know why
- **Solution:**
  - Display error message from n8n response
  - Provide "Retry Upload" button
  - Log errors server-side for debugging

### 4. Large Files
- **Problem:** 10MB files may take time to process in n8n
- **Solution:**
  - Set 60s timeout for n8n webhook POST
  - Show processing indicator with helpful message
  - Consider increasing timeout for very large PDFs
  - Future: Implement async processing with status polling

### 5. Document Deletion in Vector Table
- **Problem:** Deleting from vector table doesn't notify n8n
- **Solution:**
  - Option 1: Just delete (n8n doesn't need to know)
  - Option 2: POST delete event to n8n webhook for cleanup

### 6. Activation Without Documents
- **Problem:** Should we require at least 1 document?
- **Recommendation:** Allow 0 documents (crew can still function, just with empty knowledge base)
- **Alternative:** Require ≥1 document, disable "Continue" button in Step 1

### 7. Authorization on Vector Table Queries
- **Problem:** Vector tables are dynamic, not in schema
- **Solution:**
  - Verify crew ownership BEFORE querying vector table
  - Use crew.clientId to enforce multi-tenant isolation
  - Never expose vector table names to frontend

### 8. N8N Metadata Storage
- **Problem:** N8N may not automatically store filename in metadata
- **Solution:**
  - Verify PGVector Store node in n8n is configured to store document metadata
  - Ensure filename is preserved in metadata JSONB field
  - Update n8n workflow if needed to include filename, fileType, uploadedAt in metadata

---

## Future Enhancements (Out of Scope)

1. **Document Preview:** Display document content in modal before upload
2. **Batch Delete:** Select multiple documents and delete together
3. **Document Search:** Search within uploaded documents by filename/content
4. **Upload Progress:** Real-time progress bar with percentage
5. **Document Versioning:** Upload new version of existing document
6. **Document Categories:** Tag documents with categories (FAQ, Product Docs, etc.)
7. **Analytics:** Track which documents are most referenced in conversations
8. **Supabase Storage:** Move from base64 to proper file storage with URLs

---

## Summary

This implementation transforms the crew activation flow into a comprehensive, multi-step wizard that enables client admins to:
1. Upload knowledge base documents with n8n processing
2. Configure support settings
3. Review and activate crews

The architecture leverages existing infrastructure (vector tables, n8n webhooks, Better Auth) while adding minimal new complexity. All new code follows existing patterns for authorization, API design, and UI components.
