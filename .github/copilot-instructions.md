# DentoFlow — AI Agent Instructions

## Project Overview
DentoFlow is a React 18 + TypeScript dental practice management system with hybrid AI chatbot, multi-language support (EN/FR/AR), and role-based auth. Built with Vite, Tailwind CSS, and React Router v7.

## Architecture

### Context System (React Context API)
- **AuthContext** ([src/context/AuthContext.tsx](../src/context/AuthContext.tsx)): Mock authentication with localStorage persistence. Credentials: `admin`/`admin` or `patient`/`patient`.
- **LanguageContext** ([src/context/LanguageContext.tsx](../src/context/LanguageContext.tsx)): Provides `useLang()` hook returning `{ lang, t, setLang, isRTL }`. Auto-loads Cairo font for Arabic.

### Data Layer
All data lives in **[src/data/mockData.ts](../src/data/mockData.ts)** — exported arrays of `mockPatients`, `mockAppointments`, `mockInventory`, `mockPayments`, `mockNotifications`. **Never hardcode patient names like "Sarra Jenkins"** — always use real data from mockData.

### Hybrid AI Architecture ([src/services/ai/](../src/services/ai/))
**Local-first approach with cloud fallback:**
1. **nlpService.ts** (compromise.js) — tries local NLP first (70% confidence threshold)
2. **geminiService.ts** — fallback to Google Gemini Pro if local confidence < 70%
3. **aiService.ts** — orchestrates both, returns `AIResponse` with `source: 'local' | 'cloud'`

Key patterns:
- Intent detection: `{ action: 'create' | 'query' | 'help', entity: 'appointment' | 'patient' | 'inventory', params: {...}, confidence: number }`
- Conversation history: Array of `{ role: 'user' | 'bot', content: string }` for context-aware responses
- No API key needed for local AI; Gemini requires `VITE_GEMINI_API_KEY` in `.env`

#### Local AI Implementation (compromise.js)
**What it is:** Rule-based NLP library (~200KB), NOT a machine learning model. Zero training required.

**How it works:**
- **Pattern Matching**: Regex patterns match keywords (`schedule|planifier|جدولة`)
- **Entity Extraction**: Built-in grammar parsing recognizes:
  - People names: `doc.people().out('array')` → `["Sarah Johnson"]`
  - Dates: `doc.dates().json()` → `[{text: "tomorrow"}]`
  - Times: Regex patterns like `/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i`
  - Numbers: For ages, quantities
- **Multilingual**: Keyword arrays support EN/FR/AR simultaneously
- **Confidence Scoring**: 
  - Base confidence (0.6) for pattern match
  - +0.15 for each key parameter extracted
  - Threshold: ≥0.7 → local response, <0.7 → Gemini fallback

**Custom Handlers** ([nlpService.ts](../src/services/ai/nlpService.ts)):
```typescript
// Example: Schedule Appointment
handleScheduleAppointment(doc) {
  const params = {};
  params.patientName = doc.people().out('array')[0];
  params.treatment = matchKeywords(text, treatmentKeywords);
  params.date = doc.dates().json()[0]?.text;
  
  // Calculate confidence based on extracted params
  let confidence = 0.6; // base
  if (params.patientName) confidence += 0.15;
  if (params.treatment) confidence += 0.15;
  if (params.date || params.time) confidence += 0.1;
  
  return { action: 'create', entity: 'appointment', params, confidence };
}
```

**Why No Training Required:**
- Uses linguistic rules, not learned patterns
- Grammar analysis (English structure understanding)
- Keyword matching for domain-specific tasks
- Predictable: same input = same output
- Fast: ~10-20ms vs 1-2s for Gemini
- Private: all processing happens locally
- Free: no API costs
- Offline: works without internet

**When Gemini Activates:**
- Complex queries: "What's the best time considering Sarah's work schedule?"
- Ambiguous requests: "Help with that thing we discussed"
- Typos/misspellings: "Shdule jon do 4 cleening"
- Low confidence: When local AI can't extract enough info

### i18n System ([src/i18n/translations.ts](../src/i18n/translations.ts))
Centralized translations object with EN/FR/AR. Structure: `{ brand, nav, pages, common, status, dashboard, patients, appointments, ... }`. Always add new UI strings to all 3 languages simultaneously to avoid missing translations.

**Critical:** Use `useLang()` hook from LanguageContext, NOT `useLanguage` (old name).

### Routing & Auth Guards ([src/App.tsx](../src/App.tsx))
- `RequireAuth` HOC checks user role before rendering
- Admin routes: `/dashboard`, `/patients`, `/appointments`, `/inventory`, `/reports`, `/billing`, `/notifications`, `/settings`
- Patient route: `/portal`
- Public: `/`, `/login`
- Redirects: Unauthenticated → `/login`, wrong role → appropriate dashboard

### Component Structure
- **[src/components/](../src/components/)** — Shared UI (Layout, Sidebar, Topbar, Modal, Badge, StatCard, DentalChart)
- **[src/components/Chatbot/](../src/components/Chatbot/)** — 12 chatbot components (ChatWindow, ChatMessage, ChatInput, QuickActions, etc.)
- **[src/pages/](../src/pages/)** — Full page components for each route
- **[src/types/index.ts](../src/types/index.ts)** — All TypeScript interfaces (`Patient`, `Appointment`, `InventoryItem`, `Payment`, etc.)

## Developer Workflows

### Development
```bash
npm run dev          # Start dev server (usually port 5173, may use 5174 if busy)
npm run build        # Production build → dist/ folder (~1.4 MB bundle)
npm run typecheck    # TypeScript validation without emit
npm run lint         # ESLint check
```

### Environment Setup
Create `.env` for Gemini API (optional, local AI works without it):
```env
VITE_GEMINI_API_KEY=your_key_here
```
Get key: https://makersuite.google.com/app/apikey

### Git Conventions
Recent commits follow semantic prefixes:
- `feat:` — New features (AI integration, mobile responsiveness)
- `perf:` — Performance improvements (code splitting, lazy loading)
- `build:` — Dependencies changes
- `i18n:` — Translation updates
- `docs:` — Documentation only
- `chore:` — Maintenance (gitignore, cleanup)
- Use detailed multi-line commit messages with `-m` flags for context

## Build & Performance

### Bundle Optimization (Vite Code Splitting)
**Configuration** ([vite.config.ts](../vite.config.ts)):
- All 14 pages lazy-loaded with `React.lazy()` and `<Suspense>`
- Manual chunks for vendor code separation:
  - `react-vendor`: React, React-DOM, React-Router-DOM (~178 kB)
  - `charts`: Recharts visualization library (~386 kB)
  - `ai`: compromise.js NLP libraries (~499 kB)
  - `date-utils`: date-fns utilities (~20 kB)
- Chunk size warning limit: 600 kB
- Result: Largest chunk reduced from 1,396 kB → 499 kB (64% reduction)
- Total gzipped: ~422 kB

**LoadingFallback Pattern:**
```typescript
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        <p className="text-text-secondary text-sm">Loading…</p>
      </div>
    </div>
  );
}
```

**Why This Works:**
- Initial bundle only loads essential code + current route
- Additional pages load on-demand during navigation
- Vendor code cached separately (better caching strategy)
- Faster initial page load (~40% improvement)

## Critical Patterns

### Mobile Responsiveness
- Desktop: Fixed positioned components (e.g., chatbot 400x650px at bottom-right)
- Mobile: Full-screen overlays with `inset-0 md:inset-auto md:bottom-6 md:right-6`
- Touch optimization: `touch-manipulation` class, `active:scale-95` for haptic feedback
- Responsive text: `text-sm md:text-[14px]`, widths: `max-w-[85%] md:max-w-[280px]`

### Async AI Message Processing
ChatWindow pattern:
```typescript
const handleSendMessage = async (text: string) => {
  // Add user message immediately
  setMessages(prev => [...prev, { role: 'user', content: text }]);
  setIsTyping(true);
  
  // Process with AI
  const response = await aiService.processMessage(text, conversationHistory);
  
  // Add bot response with AI source badge
  setMessages(prev => [...prev, { 
    role: 'bot', 
    content: response.message,
    aiSource: response.intent.source  // 'local' or 'cloud'
  }]);
  setIsTyping(false);
};
```

### Date Handling
Current date in context: **7 mars 2026**. Use `date-fns` for date operations (already installed).

### Dark Mode Design
Custom Tailwind theme with dark colors:
- `background-dark: #101822` — Main background
- `surface-dark: #192433` — Cards/panels
- `border-dark: #233348` — Borders
- `text-secondary: #92a9c9` — Muted text
- `primary: #2b7cee` — Brand blue

All pages use `bg-background-dark` by default.

### TypeScript Strictness
- No `any` types — use proper interfaces from [src/types/index.ts](../src/types/index.ts)
- Use `// @ts-ignore` sparingly (currently used for compromise plugin types due to missing declarations)
- Breaking circular imports: Create separate `types.ts` files (see [src/services/ai/types.ts](../src/services/ai/types.ts))

## Common Tasks

### Adding a New Patient Field
1. Update `Patient` interface in [src/types/index.ts](../src/types/index.ts)
2. Add data to `mockPatients` in [src/data/mockData.ts](../src/data/mockData.ts)
3. Add translations to `patients` section in [src/i18n/translations.ts](../src/i18n/translations.ts) (all 3 languages)
4. Update patient detail UI in [src/pages/PatientDetailPage.tsx](../src/pages/PatientDetailPage.tsx)

### Adding a New AI Intent
1. Add pattern to `nlpService.parseIntent()` in [src/services/ai/nlpService.ts](../src/services/ai/nlpService.ts)
   - Example: `{ regex: /new|pattern|keywords/i, handler: this.handleNewIntent }`
2. Create handler method following pattern:
   ```typescript
   private handleNewIntent(doc: any): Partial<Intent> {
     const params = {};
     // Extract entities using compromise
     params.something = doc.people().out('array')[0];
     // Calculate confidence
     let confidence = 0.6;
     if (params.something) confidence += 0.15;
     return { action: 'create', entity: 'something', params, confidence };
   }
   ```
3. Add response generation logic to `aiService.generateResponseMessage()` in [src/services/ai/aiService.ts](../src/services/ai/aiService.ts)
4. Update Gemini system prompt in [src/services/ai/geminiService.ts](../src/services/ai/geminiService.ts) with new examples
5. Add chatbot translations for new commands in [src/i18n/translations.ts](../src/i18n/translations.ts) (`chatbot` section)

**Testing AI Intents:**
- Test in chatbot with variations: "schedule appointment", "book appt", "rendez-vous"
- Check AI badge shows "LOCAL" for high confidence (>70%)
- Verify Gemini fallback works for ambiguous queries
- Test multilingual keywords (EN/FR/AR)

### Adding a New Page
1. Create page component in [src/pages/](../src/pages/)
2. Add route in [src/App.tsx](../src/App.tsx) `<AppRoutes>` with appropriate `RequireAuth` wrapper
3. Add navigation entry in Sidebar ([src/components/Sidebar.tsx](../src/components/Sidebar.tsx))
4. Add translations for page title and nav label

## Known Issues & Gotchas
- **Port conflicts:** Dev server may start on 5174 if 5173 is busy
- **Hook naming:** Use `useLang()`, not `useLanguage` (changed recently)
- **Xcode license:** On macOS, `git` commands may fail until running `sudo xcodebuild -license accept`
- **Compromise types:** TypeScript errors for compromise plugins are suppressed with `// @ts-ignore`
- **Mock auth:** Authentication is localStorage-based for MVP; Supabase integration planned but not yet implemented
- **Dependencies:** 12 npm audit vulnerabilities exist (not critical for development)
