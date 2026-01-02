# Testing Guide - Phase 5 Verification

This guide provides comprehensive testing procedures for the Client Management feature implementation.

## Table of Contents
1. [Database Verification](#database-verification)
2. [API Testing](#api-testing)
3. [Client Code Generation Testing](#client-code-generation-testing)
4. [UI Testing Checklist](#ui-testing-checklist)
5. [End-to-End Verification](#end-to-end-verification)

---

## Database Verification

### Check Database Connection and Table Structure

```bash
# Connect to PostgreSQL via Docker
docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "\d clients"

# Expected output: Table with all fields (id, company_name, client_code, contact_person_name, etc.)
```

### Verify Seeded Data

```bash
# Check all clients
docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "SELECT id, company_name, client_code, status, plan FROM clients ORDER BY created_at;"

# Expected: 6 clients (Acme Corp, TechStart, RetailCo Ltd, FinanceHub Solutions, HealthTech, NewTech Solutions)
```

### Verify Indexes

```bash
docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "SELECT indexname, indexdef FROM pg_indexes WHERE tablename = 'clients';"

# Expected indexes:
# - clients_pkey (PRIMARY KEY on id)
# - clients_client_code_unique (UNIQUE on client_code)
# - client_code_idx
# - contact_email_idx
# - plan_idx
# - status_idx
```

### Test Unique Constraint

```bash
# Try inserting duplicate client_code (should fail)
docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "INSERT INTO clients (company_name, client_code, contact_person_name, contact_email, plan, status) VALUES ('Test', 'ACME-001', 'Test', 'test@test.com', 'starter', 'trial');"

# Expected: ERROR: duplicate key value violates unique constraint
```

---

## API Testing

### Prerequisites
- Development server must be running: `npm run dev`
- Server accessible at: `http://localhost:3000`

### 1. List All Clients

```bash
curl -s http://localhost:3000/api/clients | jq '.'

# Expected response:
{
  "success": true,
  "data": [...],  # Array of client objects
  "count": 6      # Total number of clients
}
```

### 2. Filter by Status

```bash
# Get active clients only
curl -s "http://localhost:3000/api/clients?status=active" | jq '.data | length'

# Expected: 5 (5 active clients out of 6 total)
```

### 3. Filter by Plan

```bash
# Get enterprise clients
curl -s "http://localhost:3000/api/clients?plan=enterprise" | jq '.data | map(.companyName)'

# Expected: ["HealthTech", "Acme Corp"]
```

### 4. Get Single Client

```bash
# Get Acme Corp details
curl -s "http://localhost:3000/api/clients/f45dcdf4-8a98-485b-8299-53c4bb4c3bd1" | jq '.'

# Expected: Client object with all fields
{
  "success": true,
  "data": {
    "id": "f45dcdf4-8a98-485b-8299-53c4bb4c3bd1",
    "companyName": "Acme Corp",
    "clientCode": "ACME-001",
    ...
  }
}
```

### 5. Create Client (All Fields)

```bash
curl -s -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company Inc",
    "contactPersonName": "Jane Doe",
    "contactEmail": "jane@testcompany.com",
    "phone": "+1-555-9999",
    "address": "123 Test Street",
    "city": "Test City",
    "country": "USA",
    "plan": "starter"
  }' | jq '.'

# Expected: Success with auto-generated client code
{
  "success": true,
  "data": {
    "clientCode": "TEST-001",
    ...
  },
  "message": "Client created successfully with code: TEST-001"
}
```

### 6. Create Client (Minimal Fields)

```bash
curl -s -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Minimal Company",
    "contactPersonName": "John Smith",
    "contactEmail": "john@minimal.com",
    "plan": "professional"
  }' | jq '.'

# Expected: Success with optional fields as null
{
  "success": true,
  "data": {
    "phone": null,
    "address": null,
    "city": null,
    "country": null,
    ...
  }
}
```

### 7. Update Client

```bash
# Update client status and add phone (replace {id} with actual ID)
curl -s -X PATCH http://localhost:3000/api/clients/{id} \
  -H "Content-Type: application/json" \
  -d '{"status": "active", "phone": "+1-555-1111"}' | jq '.'

# Expected: Updated client object
```

### 8. Validation Error Handling

```bash
# Try creating client without required fields
curl -s -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"companyName": "Test"}' | jq '.'

# Expected: Validation error with details
{
  "success": false,
  "error": "Validation failed",
  "details": [...]
}
```

### 9. 404 Error Handling

```bash
# Try getting non-existent client
curl -s http://localhost:3000/api/clients/00000000-0000-0000-0000-000000000000 | jq '.'

# Expected: 404 error
{
  "success": false,
  "error": "Client not found"
}
```

### 10. Delete Client

```bash
# Delete client (replace {id} with actual ID)
curl -s -X DELETE http://localhost:3000/api/clients/{id} | jq '.'

# Expected: Success message
{
  "success": true,
  "message": "Client deleted successfully"
}

# Verify deletion
curl -s http://localhost:3000/api/clients/{id} | jq '.'

# Expected: 404 error
```

---

## Client Code Generation Testing

### Test Sequential Generation

```bash
# Create multiple clients with similar names
curl -s -X POST http://localhost:3000/api/clients -H "Content-Type: application/json" -d '{"companyName":"Acme Corporation","contactPersonName":"Jane","contactEmail":"jane@acme2.com","plan":"starter"}' | jq '.data.clientCode'

# Expected: "ACME-002" (since ACME-001 exists)

curl -s -X POST http://localhost:3000/api/clients -H "Content-Type: application/json" -d '{"companyName":"Acme Inc","contactPersonName":"Bob","contactEmail":"bob@acme3.com","plan":"starter"}' | jq '.data.clientCode'

# Expected: "ACME-003"
```

### Test New Prefix

```bash
# Create client with completely new company name
curl -s -X POST http://localhost:3000/api/clients -H "Content-Type: application/json" -d '{"companyName":"ZenCorp Industries","contactPersonName":"Alice","contactEmail":"alice@zen.com","plan":"enterprise"}' | jq '.data.clientCode'

# Expected: "ZENCORP-001" (first client with this prefix)
```

### Test Edge Cases

```bash
# Short company name
curl -s -X POST http://localhost:3000/api/clients -H "Content-Type: application/json" -d '{"companyName":"ABC","contactPersonName":"Test","contactEmail":"test@abc.com","plan":"starter"}' | jq '.data.clientCode'

# Expected: "ABC-001"

# Company name with special characters
curl -s -X POST http://localhost:3000/api/clients -H "Content-Type: application/json" -d '{"companyName":"Tech@Corp! Inc.","contactPersonName":"Test","contactEmail":"test@tech.com","plan":"starter"}' | jq '.data.clientCode'

# Expected: "TECH-001" or "TECHCORP-001" (special chars removed)
```

**Cleanup Test Clients:**
```bash
# List all test clients and delete them
curl -s http://localhost:3000/api/clients | jq -r '.data[] | select(.companyName | test("Test|Minimal|ZenCorp|ABC|Tech@Corp")) | .id' | while read id; do
  curl -s -X DELETE "http://localhost:3000/api/clients/$id"
done
```

---

## UI Testing Checklist

### Prerequisites
- Development server running: `npm run dev`
- Browser open to: `http://localhost:3000`

### 1. Client List Page (`/admin/clients`)

- [ ] Navigate to `/admin/clients`
- [ ] Verify all clients display in the table
- [ ] Check that the following columns are visible:
  - [ ] Company Name
  - [ ] Client Code (NEW)
  - [ ] Contact Person Name (replaces old "Name")
  - [ ] Contact Email (replaces old "Email")
  - [ ] Plan badge
  - [ ] Status badge
  - [ ] Created Date
  - [ ] Actions (View button)

### 2. Client Onboarding Form

- [ ] Click "Onboard Client" button
- [ ] Verify form has the following sections:

  **Company Information:**
  - [ ] Company Name field (required)

  **Contact Information:**
  - [ ] Contact Person Name field (required)
  - [ ] Contact Email field (required)
  - [ ] Phone field (optional - no asterisk)

  **Address Information:**
  - [ ] Address field (optional)
  - [ ] City field (optional)
  - [ ] Country field (optional)

  **Plan Selection:**
  - [ ] Plan dropdown (required)

### 3. Form Validation

- [ ] Try submitting empty form - should show validation errors
- [ ] Fill only company name - should show errors for required fields
- [ ] Enter invalid email - should show email validation error
- [ ] Fill all required fields only - should submit successfully
- [ ] Fill all fields including optional ones - should submit successfully

### 4. Form Submission

- [ ] Fill out form with all fields
- [ ] Click "Create Client" button
- [ ] Verify loading state appears on button
- [ ] Verify success message shows the auto-generated client code
- [ ] Verify form closes
- [ ] Verify page refreshes and new client appears in list

### 5. Client Detail Page

- [ ] Click "View" on any client
- [ ] Navigate to `/admin/clients/{id}`
- [ ] Verify the following information displays:
  - [ ] Client Code badge (prominent display)
  - [ ] Company Name
  - [ ] Contact Person Name
  - [ ] Contact Email
  - [ ] Phone (or "N/A" if null)
  - [ ] Address section (or "N/A" if null)
  - [ ] City (or "N/A" if null)
  - [ ] Country (or "N/A" if null)
  - [ ] Plan badge
  - [ ] Status badge
  - [ ] Created date
  - [ ] Updated date

### 6. Edge Cases

- [ ] View client with all optional fields filled (e.g., Acme Corp)
- [ ] View client with no optional fields (e.g., RetailCo Ltd)
- [ ] Verify "N/A" or appropriate placeholder shows for null fields
- [ ] Test creating client with minimal fields (no phone, address, city, country)
- [ ] Verify optional fields are not marked as required in form

### 7. Error Handling

- [ ] Disconnect from internet
- [ ] Try creating a client
- [ ] Verify error message displays
- [ ] Reconnect and verify form can be submitted
- [ ] Try creating duplicate client (if validation exists)
- [ ] Verify appropriate error message

### 8. Visual Consistency

- [ ] Verify all UI components match the existing design system
- [ ] Check that badges (plan, status) use correct colors
- [ ] Verify dark mode styling is correct
- [ ] Check responsive design on mobile/tablet
- [ ] Verify empty states show properly (if any)

---

## End-to-End Verification

### Complete Workflow Test

1. **Database Check**
   ```bash
   docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "SELECT COUNT(*) FROM clients;"
   ```
   Record initial count: _______

2. **API - List Clients**
   ```bash
   curl -s http://localhost:3000/api/clients | jq '.count'
   ```
   Verify count matches database: _______

3. **UI - View List**
   - Open `http://localhost:3000/admin/clients`
   - Count clients in table
   - Verify matches API count: _______

4. **Create New Client via UI**
   - Click "Onboard Client"
   - Fill form:
     - Company Name: "E2E Test Company"
     - Contact Person: "Test User"
     - Contact Email: "test@e2e.com"
     - Phone: "+1-555-0000"
     - Address: "123 E2E Street"
     - City: "Test City"
     - Country: "USA"
     - Plan: "Starter"
   - Submit and note the client code: _______

5. **Verify in Database**
   ```bash
   docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "SELECT * FROM clients WHERE company_name = 'E2E Test Company';"
   ```
   Verify all fields match: _______

6. **Verify in API**
   ```bash
   curl -s http://localhost:3000/api/clients | jq '.data[] | select(.companyName == "E2E Test Company")'
   ```
   Verify data correctness: _______

7. **View Client Details**
   - Click "View" on the newly created client
   - Verify all fields display correctly
   - Note the client ID from URL: _______

8. **Update via API**
   ```bash
   curl -s -X PATCH http://localhost:3000/api/clients/{id} -H "Content-Type: application/json" -d '{"status":"active"}' | jq '.'
   ```

9. **Verify Update in UI**
   - Refresh client details page
   - Verify status changed to "Active": _______

10. **Delete via API**
    ```bash
    curl -s -X DELETE http://localhost:3000/api/clients/{id} | jq '.'
    ```

11. **Verify Deletion**
    - Refresh `/admin/clients`
    - Verify client no longer appears: _______
    - Check database count:
      ```bash
      docker exec plushify-demo-postgres-1 psql -U dev_user -d postgres_autocrew_dev -c "SELECT COUNT(*) FROM clients;"
      ```
    - Verify count back to initial: _______

### Success Criteria

✅ **Database Setup**
- [x] PostgreSQL connection working
- [x] Clients table created with all fields (13 columns)
- [x] Enums created for plan and status
- [x] 6 indexes created for performance
- [x] 6 clients seeded with auto-generated codes

✅ **API Functionality**
- [x] GET /api/clients - List all clients with filtering
- [x] POST /api/clients - Create with validation
- [x] GET /api/clients/:id - Get single client
- [x] PATCH /api/clients/:id - Update client
- [x] DELETE /api/clients/:id - Delete client
- [x] Client code auto-generation working
- [x] Unique constraint preventing duplicates
- [x] Error handling (404, 400, 409, 500)

✅ **Client Code Generation**
- [x] Generates unique sequential codes
- [x] Handles duplicate prefixes correctly
- [x] Starts at 001 for new prefixes
- [x] Removes special characters from company names

✅ **Type Safety**
- TypeScript types updated in `types/index.ts`
- API response types in `types/api.ts`
- No type errors in IDE

✅ **UI Integration**
- Onboarding form has all new fields
- Form handles optional fields correctly
- Client list shows updated fields
- Client detail page displays all information
- Error handling works

---

## Automated Testing

### Run Automated API Tests

```bash
# Make script executable
chmod +x tests/api-test.sh

# Run tests
./tests/api-test.sh
```

The automated test suite will:
- Test all API endpoints
- Verify CRUD operations
- Test validation and error handling
- Test client code generation
- Clean up test data
- Provide a summary report

---

## Notes

- All tests assume the development server is running on `http://localhost:3000`
- Database tests require Docker PostgreSQL container to be running
- UI tests are manual and require a browser
- Always clean up test data after testing
- Client codes are auto-generated and cannot be manually set

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL container is running
docker ps | grep postgres

# Check database exists
docker exec plushify-demo-postgres-1 psql -U dev_user -l | grep postgres_autocrew_dev
```

### API Not Responding
```bash
# Check if dev server is running
lsof -i :3000

# Restart dev server
npm run dev
```

### Migration Issues
```bash
# Re-run migrations
npm run db:migrate

# Re-seed database
npm run db:seed
```
