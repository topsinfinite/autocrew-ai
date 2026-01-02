#!/bin/bash

# API Testing Suite for Client Endpoints
# Run this script after starting the dev server: npm run dev

BASE_URL="http://localhost:3000"
PASS_COUNT=0
FAIL_COUNT=0

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "========================================="
echo "API Testing Suite - Client Endpoints"
echo "========================================="
echo ""

# Helper function to run tests
run_test() {
  local test_name="$1"
  local curl_cmd="$2"
  local expected_pattern="$3"

  echo -n "Testing: $test_name... "

  response=$(eval "$curl_cmd" 2>&1)

  if echo "$response" | grep -q "$expected_pattern"; then
    echo -e "${GREEN}✓ PASS${NC}"
    ((PASS_COUNT++))
  else
    echo -e "${RED}✗ FAIL${NC}"
    echo "  Expected pattern: $expected_pattern"
    echo "  Response: $response"
    ((FAIL_COUNT++))
  fi
}

# Test 1: List all clients
run_test "GET /api/clients - List all clients" \
  "curl -s $BASE_URL/api/clients" \
  '"success":true'

# Test 2: Filter by status
run_test "GET /api/clients?status=active - Filter by status" \
  "curl -s '$BASE_URL/api/clients?status=active'" \
  '"status":"active"'

# Test 3: Filter by plan
run_test "GET /api/clients?plan=enterprise - Filter by plan" \
  "curl -s '$BASE_URL/api/clients?plan=enterprise'" \
  '"plan":"enterprise"'

# Test 4: Get single client (using Acme Corp ID from seed data)
run_test "GET /api/clients/:id - Get single client" \
  "curl -s $BASE_URL/api/clients/f45dcdf4-8a98-485b-8299-53c4bb4c3bd1" \
  '"companyName":"Acme Corp"'

# Test 5: Create client with all fields
CREATE_RESPONSE=$(curl -s -X POST $BASE_URL/api/clients \
  -H "Content-Type: application/json" \
  -d '{"companyName":"API Test Company","contactPersonName":"Test User","contactEmail":"test@apitest.com","phone":"+1-555-0000","address":"API Test Address","city":"Test City","country":"USA","plan":"starter"}')

if echo "$CREATE_RESPONSE" | grep -q '"success":true'; then
  echo -e "Testing: POST /api/clients - Create with all fields... ${GREEN}✓ PASS${NC}"
  ((PASS_COUNT++))

  # Extract created client ID for further tests
  CREATED_ID=$(echo "$CREATE_RESPONSE" | jq -r '.data.id')
  CREATED_CODE=$(echo "$CREATE_RESPONSE" | jq -r '.data.clientCode')

  echo "  Created client: $CREATED_CODE (ID: $CREATED_ID)"
else
  echo -e "Testing: POST /api/clients - Create with all fields... ${RED}✗ FAIL${NC}"
  echo "  Response: $CREATE_RESPONSE"
  ((FAIL_COUNT++))
fi

# Test 6: Create client with minimal fields
CREATE_MIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/clients \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Minimal Test","contactPersonName":"Min User","contactEmail":"min@test.com","plan":"professional"}')

if echo "$CREATE_MIN_RESPONSE" | grep -q '"success":true'; then
  echo -e "Testing: POST /api/clients - Create with minimal fields... ${GREEN}✓ PASS${NC}"
  ((PASS_COUNT++))

  MIN_ID=$(echo "$CREATE_MIN_RESPONSE" | jq -r '.data.id')

  # Verify optional fields are null
  if echo "$CREATE_MIN_RESPONSE" | grep -q '"phone":null'; then
    echo "  ✓ Optional fields properly set to null"
  fi
else
  echo -e "Testing: POST /api/clients - Create with minimal fields... ${RED}✗ FAIL${NC}"
  echo "  Response: $CREATE_MIN_RESPONSE"
  ((FAIL_COUNT++))
fi

# Test 7: Update client
if [ ! -z "$CREATED_ID" ]; then
  run_test "PATCH /api/clients/:id - Update client" \
    "curl -s -X PATCH $BASE_URL/api/clients/$CREATED_ID -H 'Content-Type: application/json' -d '{\"status\":\"active\"}'" \
    '"status":"active"'
fi

# Test 8: Validation error - missing required fields
run_test "POST /api/clients - Validation error handling" \
  "curl -s -X POST $BASE_URL/api/clients -H 'Content-Type: application/json' -d '{\"companyName\":\"Test\"}'" \
  '"error":"Validation failed"'

# Test 9: 404 error - non-existent client
run_test "GET /api/clients/:id - 404 error handling" \
  "curl -s $BASE_URL/api/clients/00000000-0000-0000-0000-000000000000" \
  '"error":"Client not found"'

# Test 10: Delete client
if [ ! -z "$CREATED_ID" ]; then
  run_test "DELETE /api/clients/:id - Delete client" \
    "curl -s -X DELETE $BASE_URL/api/clients/$CREATED_ID" \
    '"success":true'

  # Verify deletion
  run_test "Verify deletion - Client should not exist" \
    "curl -s $BASE_URL/api/clients/$CREATED_ID" \
    '"error":"Client not found"'
fi

# Cleanup - delete minimal test client
if [ ! -z "$MIN_ID" ]; then
  curl -s -X DELETE $BASE_URL/api/clients/$MIN_ID > /dev/null
  echo -e "${YELLOW}Cleanup: Deleted test client $MIN_ID${NC}"
fi

# Summary
echo ""
echo "========================================="
echo "Test Summary"
echo "========================================="
echo -e "Tests Passed: ${GREEN}$PASS_COUNT${NC}"
echo -e "Tests Failed: ${RED}$FAIL_COUNT${NC}"
echo "Total Tests: $((PASS_COUNT + FAIL_COUNT))"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
  echo -e "${GREEN}✓ All tests passed!${NC}"
  exit 0
else
  echo -e "${RED}✗ Some tests failed${NC}"
  exit 1
fi
