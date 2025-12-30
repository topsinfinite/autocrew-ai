# AutoCrew SaaS Platform

A B2B digital labor platform that allows small businesses to manage "Agentic Crews" powered by n8n workflows.

## Design Language

**Professional, Industrious, High-Trust**
- **Dark Mode Primary Theme**: Professional slate tones for an industrious feel
- **Action Orange** (#F97316): Primary accent for CTAs and important actions
- **Cyber Blue** (#0EA5E9): Secondary accent for information and status
- **Empty State First**: Thoughtfully designed empty states guide new users through setup

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Shadcn UI
- **Auth**: Better-Auth (to be configured)
- **ORM**: Drizzle ORM (to be configured)
- **Database**: Supabase PostgreSQL (to be configured)
- **Agentic Logic**: n8n (External webhooks)
- **Analytics**: Recharts for data visualization

## Current Features (Phase 1 - UI Only)

### Dashboard
- Professional dark mode command center with Action Orange accents
- Summary statistics cards showing:
  - Total crews
  - Active conversations
  - Leads generated
  - Active crew status
- Recent conversations feed with sentiment indicators
- Active agent crews overview
- **Empty states** for first-time users with guided CTAs

### Analytics & Insights
- Interactive date range picker for filtering data
- Conversation volume line chart with smooth animations
- Leads generated bar chart with Cyber Blue styling
- Sentiment distribution analysis
- Real-time metrics and KPIs
- Enhanced chart visualizations for dark mode

### Conversations
- Searchable conversation logs table
- Drill-down dialog for full transcript viewing
- Sentiment indicators (positive/neutral/negative)
- Resolution status tracking
- Customer information display
- **Smart empty states** for no data and search results

### Agent Crews Management
- Full CRUD interface for managing crews
- Crew configuration:
  - Name
  - Type (Support/Lead Generation)
  - n8n Webhook URL
  - Status (Active/Inactive/Error)
- Stats overview with crew metrics
- **Guided empty state** for first-time setup

### UI/UX Features
- Professional dark mode with high-trust aesthetic
- Action Orange for primary CTAs
- Cyber Blue for information and status
- Empty state designs that guide new users
- Smooth transitions and animations
- Enhanced sidebar with system status indicator

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/
│   ├── (dashboard)/        # Dashboard route group
│   │   ├── analytics/      # Analytics page
│   │   ├── conversations/  # Conversations page
│   │   ├── crews/          # Agent crews management
│   │   ├── dashboard/      # Main dashboard
│   │   ├── settings/       # Settings page
│   │   └── layout.tsx      # Dashboard layout with sidebar
│   ├── globals.css         # Global styles and theme
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page (redirects to dashboard)
├── components/
│   ├── ui/                 # Shadcn UI components
│   ├── date-range-picker.tsx
│   └── sidebar.tsx         # Navigation sidebar
├── lib/
│   ├── dummy-data.ts       # Mock data for UI testing
│   └── utils.ts            # Utility functions
└── types/
    └── index.ts            # TypeScript type definitions
```

## Database Schema (To Be Implemented)

### Users & Sessions
- Better-Auth compatible tables

### Crews
- id, userId, name, type (Support/LeadGen)
- n8nWebhookUrl, createdAt, updatedAt

### Conversations
- id, crewId, userId
- transcript (JSONB), metadata
- createdAt

### Leads
- id, crewId, email, name
- data (JSONB), createdAt

## Next Steps

1. **Backend Integration**
   - Set up Supabase PostgreSQL database
   - Configure Drizzle ORM and migrations
   - Implement Better-Auth authentication

2. **n8n Integration**
   - Create webhook endpoints
   - Implement callback handlers
   - Set up crew triggers

3. **Real Data**
   - Replace dummy data with API calls
   - Implement data fetching hooks
   - Add loading and error states

4. **Additional Features**
   - User authentication and authorization
   - Real-time updates (webhooks/SSE)
   - Advanced filtering and search
   - Export functionality
   - Team management

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

ISC
