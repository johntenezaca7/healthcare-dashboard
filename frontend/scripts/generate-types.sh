#!/bin/bash

# Script to generate TypeScript types from FastAPI OpenAPI schema
# Usage: ./scripts/generate-types.sh

set -e

API_URL="${API_URL:-http://localhost:8000}"
OUTPUT_FILE="${OUTPUT_FILE:-src/types/api.ts}"

echo "🔍 Fetching OpenAPI schema from ${API_URL}/openapi.json..."

# Check if backend is running
if ! curl -s -f "${API_URL}/openapi.json" > /dev/null 2>&1; then
    echo "❌ Error: Backend is not running at ${API_URL}"
    echo "   Please start the backend server first:"
    echo "   cd backend && uvicorn app.main:app --reload"
    exit 1
fi

echo "📦 Generating TypeScript types..."

# Generate types using openapi-typescript
npx openapi-typescript "${API_URL}/openapi.json" -o "${OUTPUT_FILE}"

echo "✅ Types generated successfully at ${OUTPUT_FILE}"
echo ""
echo "💡 Tip: Add this to your package.json scripts:"
echo "   \"generate:types\": \"openapi-typescript http://localhost:8000/openapi.json -o src/types/api.ts\""

