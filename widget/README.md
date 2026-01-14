# AutoCrew Chat Widget

Embeddable chat widget for AutoCrew SaaS platform. This widget allows clients to add AI-powered chat to their websites.

## Quick Start

Add this code to your website before the closing `</body>` tag:

```html
<script>
  window.AutoCrewConfig = {
    webhookUrl: 'YOUR_N8N_WEBHOOK_URL',
    crewCode: 'YOUR_CREW_CODE',
    clientId: 'YOUR_CLIENT_ID',
  };
</script>
<script src="https://autocrew-saas.vercel.app/widget.js" async></script>
```

## Configuration Options

| Option | Type | Required | Default | Description |
|--------|------|----------|---------|-------------|
| `webhookUrl` | string | Yes | - | n8n Chat Trigger webhook URL |
| `crewCode` | string | Yes | - | Crew identifier |
| `clientId` | string | Yes | - | Client/tenant identifier |
| `metadata` | object | No | auto-generated | n8n Chat Trigger metadata (see below) |
| `agentName` | string | No | - | Agent name (used in metadata if not provided) |
| `primaryColor` | string | No | `#0891b2` | Primary accent color (hex) |
| `position` | string | No | `bottom-right` | Widget position: `bottom-right` or `bottom-left` |
| `theme` | string | No | `auto` | Theme: `light`, `dark`, or `auto` |
| `title` | string | No | `Chat with us` | Widget header title |
| `subtitle` | string | No | `` | Widget header subtitle |
| `welcomeMessage` | string | No | `Hi! How can I help you today?` | First message from assistant |
| `firstLaunchAction` | string | No | `none` | First visit behavior: `none`, `auto-open`, or `show-greeting` |
| `greetingDelay` | number | No | `3000` | Delay before showing greeting (ms) |

### Metadata Object

The `metadata` object is passed to n8n Chat Trigger with each message. If not provided, it's auto-generated:

```javascript
metadata: {
  client_id: 'YOUR_CLIENT_ID',     // From clientId
  crew_code: 'YOUR_CREW_CODE',     // From crewCode
  agent_name: 'Agent Name',        // From agentName or metadata.agent_name
  environment: 'production',       // Auto-detected (localhost = development)
  // ... any custom fields
}
```

## Example with Full Configuration

```html
<script>
  window.AutoCrewConfig = {
    // Required
    webhookUrl: 'https://n8n.example.com/webhook/abc123',
    crewCode: 'ACME-001-SUP-001',
    clientId: 'ACME-001',

    // n8n metadata (optional)
    metadata: {
      client_id: 'ACME-001',
      crew_code: 'ACME-001-SUP-001',
      agent_name: 'Alex',
      environment: 'production'
    },

    // Appearance
    primaryColor: '#10b981',
    position: 'bottom-right',
    theme: 'auto',

    // Branding
    title: 'Chat with Alex',
    subtitle: 'We reply within minutes',
    welcomeMessage: 'Hello! I\'m Alex, your ACME support assistant. How can I help?',

    // Behavior
    firstLaunchAction: 'show-greeting',
    greetingDelay: 3000,
  };
</script>
<script src="https://autocrew-saas.vercel.app/widget.js" async></script>
```

## Development

### Prerequisites

- Node.js 18+
- npm

### Setup

```bash
cd widget
npm install
```

### Build

```bash
npm run build        # Production build
npm run build:watch  # Watch mode for development
```

### Type Check

```bash
npm run typecheck
```

### Testing

Open `test.html` in a browser to test the widget locally.

## Architecture

```
widget/
├── src/
│   ├── index.ts           # Entry point
│   ├── widget.ts          # Main widget class
│   ├── types.ts           # TypeScript types
│   ├── components/        # UI components
│   ├── services/          # API and storage
│   ├── styles/            # CSS generation
│   └── utils/             # Helper functions
├── dist/
│   └── widget.js          # Built output (~23KB)
└── test.html              # Local testing page
```

## Features

- **Shadow DOM**: Styles are isolated from host website
- **Theme Support**: Light, dark, and auto (system preference)
- **Session Persistence**: Conversations persist across page refreshes
- **Accessibility**: ARIA labels, keyboard navigation, focus management
- **Mobile Responsive**: Adapts to smaller screens
- **Error Handling**: Graceful handling of network errors with retry logic

## n8n Integration

The widget communicates with n8n Chat Trigger webhooks using this format:

**Request:**
```json
{
  "action": "sendMessage",
  "sessionId": "ac_xxxxx_xxxxx",
  "chatInput": "User message text",
  "metadata": {
    "client_id": "ACME-001",
    "crew_code": "ACME-001-SUP-001",
    "agent_name": "Alex",
    "environment": "production"
  }
}
```

**Response:**
```json
{
  "output": "Assistant response text"
}
```

## Browser Support

- Chrome/Edge 79+
- Firefox 63+
- Safari 12.1+
- iOS Safari 12.2+

## License

Proprietary - AutoCrew SaaS
