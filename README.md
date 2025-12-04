# Healthcare Dashboard

A full-stack healthcare management application built with React (TypeScript) and FastAPI (Python).

## Prerequisites

- **Docker & Docker Compose** (recommended) OR
- **Node.js 18+** and **pnpm** (for frontend)
- **Python 3.11+** (for backend)

## Quick Start with Docker

The easiest way to run the application is using Docker Compose:

### 1. Start Both Services

```bash
# Build and start both frontend and backend
docker compose up --build

# Or run in detached mode (background)
docker compose up --build -d
```

### 2. Generate Sample Data

Once the services are running, generate sample patient data:

```bash
# Generate 1500 sample patients
docker compose exec api python -m app.generate_data
```

### 3. Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **API Documentation**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 4. Stop Services

```bash
# Stop services
docker compose down

# Stop and remove volumes (clears database)
docker compose down -v
```

## Local Development Setup

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start the backend server:**
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. **Generate sample data:**
   ```bash
   python -m app.generate_data
   ```

The backend will be available at http://localhost:8000

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start the development server:**
   ```bash
   pnpm run dev
   ```

The frontend will be available at http://localhost:5173

### Generate TypeScript Types from API

After starting the backend, generate TypeScript types from the OpenAPI schema:

```bash
cd frontend
pnpm run generate:types
```

This will generate types from `http://localhost:8000/openapi.json` into `src/types/api.ts`.

## Project Structure

```
.
├── backend/                    # FastAPI backend application
│   ├── app/                    # Application code
│   │   ├── api/                # API routes
│   │   │   └── v1/             # API version 1
│   │   │       └── endpoints/  # Endpoint handlers
│   │   ├── core/               # Core configuration
│   │   │   ├── config.py      # Settings
│   │   │   ├── database.py    # Database setup
│   │   │   ├── security.py    # Authentication
│   │   │   └── permissions.py # Authorization
│   │   ├── services/           # Business logic
│   │   ├── models.py           # SQLAlchemy models
│   │   ├── schemas.py          # Pydantic schemas
│   │   └── generate_data.py    # Sample data generator
│   └── requirements.txt
│
├── frontend/                   # React + TypeScript frontend
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ui/            # Design system (Atomic Design)
│   │   │   │   ├── atoms/     # Basic UI elements (Button, Input, Card, etc.)
│   │   │   │   └── molecules/ # Composite components (Table, Select, Breadcrumb, etc.)
│   │   │   ├── create-patient/     # Patient creation forms
│   │   │   ├── editable-patient-information/  # Patient edit cards
│   │   │   ├── patient-details/    # Patient detail components
│   │   │   ├── patients-list/      # Patient list components
│   │   │   ├── home-dashboard/     # Dashboard components
│   │   │   ├── columns-bucket/     # Table column definitions
│   │   │   └── ErrorBoundary.tsx   # Error boundary component
│   │   │
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── queries/        # React Query hooks
│   │   │   │   └── Patients/   # Patient query hooks & QueryKey factory
│   │   │   ├── mutations/      # React Query mutations
│   │   │   │   └── Patients/   # Patient mutation hooks
│   │   │   ├── auth/           # Authentication hooks
│   │   │   ├── patientList/    # Patient list filters hook
│   │   │   └── util/           # Utility hooks (useDebounce)
│   │   │
│   │   ├── pages/              # Page components
│   │   │   ├── Login.tsx       # Login page
│   │   │   ├── PatientList.tsx # Patient list page
│   │   │   ├── PatientDetail.tsx # Patient detail page
│   │   │   ├── PatientCreate.tsx # Patient creation page
│   │   │   ├── NotFound.tsx   # 404 page
│   │   │   └── future-work/    # Pages with mock data (future features)
│   │   │
│   │   ├── context/            # React Context providers
│   │   │   └── auth/           # Authentication context
│   │   │
│   │   ├── lib/                # Library configurations
│   │   │   └── queryClient.ts # React Query client setup
│   │   │
│   │   ├── utils/              # Utility functions
│   │   │   ├── constants.ts   # App constants & routes
│   │   │   ├── errorMessages.ts # Centralized error messages
│   │   │   ├── date.ts        # Date utilities
│   │   │   ├── format.ts      # Formatting utilities
│   │   │   └── object.ts       # Object utilities
│   │   │
│   │   ├── types/              # TypeScript type definitions
│   │   │   ├── api.ts         # Generated API types (from OpenAPI)
│   │   │   ├── auth.ts        # Authentication types
│   │   │   └── schemas.ts      # Domain schemas
│   │   │
│   │   ├── styles/             # Global styles
│   │   │   ├── globals.css    # Global CSS
│   │   │   └── utils.ts       # Tailwind utility functions
│   │   │
│   │   ├── theme/              # Theme configuration
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── ModeToggle.tsx
│   │   │
│   │   ├── schemas/            # Zod validation schemas
│   │   │   └── patient.ts
│   │   │
│   │   ├── test/               # Test utilities
│   │   │   ├── setup.ts       # Vitest setup
│   │   │   └── utils.tsx      # Testing utilities
│   │   │
│   │   ├── App.tsx             # Root app component
│   │   ├── AppRouter.tsx      # Route configuration
│   │   └── main.tsx            # Entry point
│   │
│   ├── scripts/                # Build scripts
│   │   └── generate-types.sh   # Type generation script
│   │
│   ├── package.json
│   ├── vite.config.ts          # Vite configuration
│   ├── vitest.config.ts        # Vitest configuration
│   └── tsconfig.json           # TypeScript configuration
│
└── docker-compose.yml           # Docker Compose configuration
```

### Frontend Architecture

The frontend follows **Atomic Design** principles and **feature-based** organization:

- **Atoms** (`components/ui/atoms/`): Basic, reusable UI elements (Button, Input, Card, Badge, etc.)
- **Molecules** (`components/ui/molecules/`): Composite components built from atoms (Table, Select, Breadcrumb, Pagination, etc.)
- **Feature Components**: Domain-specific components organized by feature:
  - `create-patient/` - Patient creation forms
  - `editable-patient-information/` - Patient editing components
  - `patient-details/` - Patient detail view components
  - `patients-list/` - Patient list and filtering components

**Hooks Organization:**
- `queries/` - Data fetching hooks (React Query)
- `mutations/` - Data mutation hooks (React Query)
- Organized by domain (e.g., `Patients/`) with shared QueryKey factories

**State Management:**
- React Query for server state
- React Context for authentication state
- Local state with React hooks for component state

## Demo Credentials

Use these credentials to log in:

- **Admin**: `admin@example.com` / `admin123`
- **Doctor**: `doctor@example.com` / `doctor123`
- **Nurse**: `nurse@example.com` / `nurse123`

## Available Scripts

### Frontend

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run test` - Run tests
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run generate:types` - Generate TypeScript types from API

### Backend

- `uvicorn app.main:app --reload` - Start development server
- `python -m app.generate_data` - Generate sample patient data

## Docker Commands

```bash
# View logs
docker compose logs -f

# View logs for specific service
docker compose logs -f api
docker compose logs -f web

# Rebuild without cache
docker compose build --no-cache

# Restart a specific service
docker compose restart api
docker compose restart web
```

## Environment Variables

### Backend

- `DATABASE_PATH` - Path to SQLite database (default: `healthcare.db`)
- `SECRET_KEY` - Secret key for JWT tokens (default: development key)

### Frontend

- `VITE_API_BASE_URL` - Backend API URL (default: `http://localhost:8000`)

## Database

The application uses SQLite for development. The database file (`healthcare.db`) is created automatically when you first run the backend or generate data.

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## Feature Status

### ✅ Part 1: Project Foundation & Architecture

- ✅ **Project Initialization**: Vite + React + TypeScript
- ✅ **Core Dependencies**:
  - UI Framework: Radix UI components
  - State Management: React Query (TanStack Query)
  - Routing: React Router v6
  - Styling: Tailwind CSS
  - Testing: Vitest + React Testing Library
- ✅ **Development Tooling**:
  - ESLint configuration
  - Prettier formatting
  - TypeScript strict mode
  - Build optimization (Vite)
- ✅ **Scalable Folder Structure**:
  - Atomic Design pattern (atoms/molecules)
  - Feature-based organization
  - Shared utilities and hooks
  - Support for multiple user types

### ✅ Part 2: Core Dashboard Implementation

- ✅ **Backend Service**: FastAPI with SQLite database
- ✅ **Sample Data Generation**: Script generates 1500+ realistic patients
- ✅ **Responsive Layout**:
  - Header with navigation
  - Collapsible sidebar
  - Main content area
  - Footer
- ✅ **PatientList Component**:
  - Efficient rendering (handles 1000+ patients)
  - Search functionality (debounced, non-blocking)
  - Advanced filtering (status, blood type, insurance, etc.)
  - Sorting capabilities
  - Pagination (25 items per page)
  - Responsive design
- ✅ **Routing**:
  - Dashboard home (/)
  - Patient list (/patients)
  - Patient detail (/patients/:id)
  - Patient create (/patients/new)
  - Login (/login)
  - 404 page
  - Protected routes with role-based access

### ✅ Part 3: State & Form Management

- ✅ **Patient Form**:
  - Personal information section
  - Medical history (allergies, medications, conditions)
  - Insurance information
  - Emergency contacts
- ✅ **Form Features**:
  - Backend endpoints (CRUD operations)
  - Field-level validation (Zod schemas)
  - Error handling and display
- ✅ **State Management**:
  - React Query for server state
  - React Context for authentication
  - Local state for component state
- ✅ **Error Handling**:
  - Error Boundary component
  - Network failure handling
  - Validation error display
  - Permission error handling (role-based routes)
  - Centralized error messages

### ✅ Stretch Goals Implemented

- ✅ **Dark/Light Theme Switching**: Full theme support with persistence
- ✅ **Advanced Search with Filters**: Multi-criteria filtering system
- ✅ **Auth and User Session**: JWT-based authentication with role management
- ✅ **Testing**: Unit tests for critical components and hooks
- ✅ **Error Boundary**: Global error boundary implementation
- ✅ **Accessibility**: ARIA labels, roles, and semantic HTML
- ✅ **Memoization**: React.memo used for performance optimization

### ❌ Not Implemented / Future Work

- ❌ **File Upload**: Patient photos and document uploads (UI exists but upload functionality not connected)
- ❌ **Global Notifications**: Toast/notification system for app-wide alerts
- ❌ **Data Visualization**: Charts component exists but uses mock data (needs backend integration)
- ❌ **Virtualization**: List virtualization for very large datasets (1000+ works but could be optimized)
- ❌ **Code Splitting**: Lazy loading for routes/components
- ❌ **Real-time Features**: WebSocket integration for live updates
- ❌ **Auto-save Drafts**: Form draft persistence
- ❌ **Drag-and-Drop**: No drag-and-drop functionality
- ❌ **Storybook**: Component documentation/storybook
- ❌ **CI/CD Pipeline**: Continuous integration/deployment setup
- ❌ **Internationalization (i18n)**: Multi-language support
- ❌ **Analytics/Monitoring**: Error tracking and analytics
- ❌ **Service Workers**: Offline capability
- ❌ **E2E Tests**: End-to-end testing setup

### 📝 Pages with Mock Data (Future Work)

The following pages exist but use mock data and are located in `pages/future-work/`:
- Home Dashboard (uses mock metrics)
- Appointments
- Clinical Notes
- Medications
- Labs Results
- Insurance Management
- Reports
- Tasks
- User Management
- Settings

These pages are functional but need backend integration to be fully operational.

