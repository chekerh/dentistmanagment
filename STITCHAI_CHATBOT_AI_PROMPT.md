# StitchAI Master Prompt: DentoFlow AI Assistant Interface

## Project Context
Build a conversational AI chatbot interface for DentoFlow, a modern dental practice management system. The chatbot enables natural language interaction for scheduling appointments, managing patients, checking inventory, and answering questions about the system.

## Design System Reference
- **Color Palette**: 
  - Primary: Blue (#3B82F6, #2563EB)
  - Success: Green (#10B981)
  - Warning: Amber (#F59E0B)
  - Danger: Red (#EF4444)
  - Neutral: Slate (#64748B, #F8FAFC)
- **Typography**: Inter font family, modern sans-serif
- **Style**: Clean, medical-grade UI with subtle gradients and glass-morphism effects
- **Language Support**: Multilingual (English, French, Arabic with RTL support)

## Required Interfaces

### 1. Main Chat Window
**Component**: Floating chat window (bottom-right corner)

**Visual Requirements**:
- Dimensions: 400px width × 650px height
- Border radius: 16px with subtle shadow
- Glass-morphism header with blur effect
- Smooth slide-in animation from bottom-right

**Header Section**:
- DentoFlow AI logo/icon (robot/tooth hybrid icon)
- Status indicator: "Online" with pulsing green dot
- Minimize button (–)
- Close button (×)
- Background: Semi-transparent white with backdrop-blur

**Messages Area**:
- Scrollable container with custom scrollbar styling
- Message bubbles:
  - **Bot messages**: Left-aligned, light blue background (#EFF6FF), rounded corners
  - **User messages**: Right-aligned, blue gradient (#3B82F6 to #2563EB), white text
  - Timestamp below each message (small, muted)
  - Typing indicator: 3 animated dots when bot is processing

**Welcome State**:
- Display when no messages exist
- Friendly greeting: "Hi! I'm your DentoFlow AI Assistant 👋"
- Subtitle: "Ask me anything or try a quick action below"
- Quick action buttons grid (2×2):
  - "📅 Schedule Appointment"
  - "👤 Add New Patient"
  - "📦 Check Inventory"
  - "💰 Billing & Invoices"

**Input Section**:
- Text input with placeholder: "Type your message or command..."
- Send button: Blue circle with paper plane icon
- Voice input button (microphone icon) - visual only
- Auto-resize textarea (max 4 lines)

---

### 2. Command Preview Card
**Purpose**: Show parsed command before execution for user confirmation

**Visual Requirements**:
- Appears as bot message with special styling
- Background: White with blue left border (4px)
- Shadow: Elevated card effect

**Content Structure**:
- **Icon**: Action-specific (calendar for appointments, user for patients, etc.)
- **Title**: "I'll help you [action]"
- **Details Section**: 
  - Grid layout showing extracted parameters
  - Label: Small, uppercase, muted text
  - Value: Bold, dark text
  - Example fields:
    - Patient Name
    - Treatment Type
    - Date & Time
    - Doctor
    - Room (if applicable)

**Action Buttons**:
- Primary: "✓ Confirm & Execute" (green gradient button)
- Secondary: "✗ Cancel" (transparent with border)
- Buttons side-by-side, full width

---

### 3. Confirmation Modal
**Purpose**: Final confirmation for critical actions (delete, update billing)

**Visual Requirements**:
- Overlay: Dark backdrop (rgba(0,0,0,0.5)) with blur
- Modal: 500px width, centered, white background
- Border radius: 20px
- Entrance animation: Fade + scale from 0.9 to 1.0

**Content**:
- **Header**:
  - Warning/info icon in colored circle (amber for caution, red for danger)
  - Title: "Confirm Action"
  - Subtitle: Specific action description

- **Summary Card**:
  - Same styling as Command Preview
  - Shows all affected data
  - Highlight critical fields in bold

- **Footer Buttons**:
  - Cancel: Left, gray with border
  - Confirm: Right, colored (red for delete, blue for update)
  - Loading state: Spinner + disabled state

---

### 4. AI Response Types

#### 4a. Simple Text Response
- Standard bot message bubble
- Support for markdown formatting:
  - **Bold** for emphasis
  - `Code` for system terms
  - Bullet points for lists
  - Links underlined in blue

#### 4b. Rich Card Response
**For complex information display**

**Patient Summary Card**:
- Patient name + age in header
- Avatar/initials circle (colored by status)
- Grid of key info:
  - Last visit
  - Next appointment
  - Outstanding balance
  - Allergies (red badge if any)
- "View Full Record" link button

**Appointment List Card**:
- Horizontal scroll of mini appointment cards
- Each card shows:
  - Time badge (top-left)
  - Patient name
  - Treatment type icon
  - Status badge (Confirmed/In Progress/Completed)

**Inventory Status Card**:
- Item name with icon
- Stock level progress bar:
  - Green: In stock (>50 units)
  - Amber: Low stock (10-50 units)
  - Red: Critical (<10 units)
- "Reorder" button if low

#### 4c. Suggestion Chips
**Below bot messages for quick replies**

**Visual**:
- Horizontal scrollable row
- Rounded pill buttons
- Light gray background (#F1F5F9)
- Hover: Blue background
- Icon + text label

**Examples**:
- "📅 View Schedule"
- "✉️ Send Reminder"
- "📊 Show Analytics"
- "➕ Add Another"

---

### 5. Quick Actions Panel
**Alternative interface when user clicks quick action buttons**

**Visual Requirements**:
- Slides in from right side of chat window
- Same height as chat
- White background
- Back arrow button (top-left)

**Schedule Appointment Panel**:
- Step indicator (1/4, 2/4, etc.)
- Form fields with AI-assisted autocomplete:
  - Patient selector (searchable dropdown)
  - Treatment type (icon grid selection)
  - Date picker (calendar widget)
  - Time slots (grid of available times, green=available, gray=booked)
  - Doctor selector (cards with avatars)
  - Notes (optional textarea)
- Progress bar at top
- "Next" / "Previous" navigation buttons

---

### 6. Chat Settings/History Panel
**Accessed via header gear icon**

**Visual Requirements**:
- Slide-in panel from right
- Tabbed interface:
  - **Settings Tab**:
    - AI Mode toggle (Local / Cloud / Hybrid)
    - Language selector
    - Notification preferences
    - Clear history button (danger zone)
  - **History Tab**:
    - Searchable list of past conversations
    - Grouped by date ("Today", "Yesterday", "Last Week")
    - Click to load conversation
    - Delete option per conversation

---

### 7. Loading & Error States

**Loading State**:
- Skeleton screens for message bubbles
- Pulsing animation (shimmer effect)
- Progress indicator for long operations

**Error State**:
- Red error card in message flow
- Error icon (⚠️ or ❌)
- Error message: "Oops! Something went wrong"
- Error code/details in smaller text
- "Try Again" button
- "Contact Support" link

**Offline State**:
- Amber banner at top of chat
- "You're offline - Using local AI only"
- Retry connection button

**AI Fallback Indicator**:
- Small badge on bot messages: "🌐 Cloud AI" or "💻 Local AI"
- Helps users understand which AI responded

---

### 8. Typing Indicators & Animations

**Bot Typing Indicator**:
- Three dots bouncing animation
- Light blue bubble
- Appears immediately when user sends message

**Message Entrance**:
- Slide up + fade in
- Staggered timing for multiple messages
- Smooth 300ms transition

**Sent Confirmation**:
- User message: Quick scale pulse
- Checkmark appears (sent ✓, delivered ✓✓, read ✓✓✓)

---

### 9. Accessibility Features

**Required Elements**:
- ARIA labels on all interactive elements
- Keyboard navigation support (Tab, Enter, Esc)
- Screen reader announcements for new messages
- High contrast mode toggle
- Focus indicators (blue outline on active elements)
- Voice input visual feedback (pulsing microphone when recording)

---

### 10. Mobile Responsive Variant

**Adjustments for <768px**:
- Chat expands to full screen (minus small header)
- Bottom sheet style instead of floating window
- Larger touch targets (min 44px)
- Simplified header (just title + close)
- Swipe down to close gesture
- Virtual keyboard aware (input stays visible)

---

## Design Specifications Summary

### Spacing Scale
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px

### Shadow Levels
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.15)
- xl: 0 20px 25px rgba(0,0,0,0.2)

### Animation Durations
- Fast: 150ms (hover, clicks)
- Normal: 300ms (transitions)
- Slow: 500ms (page changes, modals)

### Border Radius
- sm: 8px (small buttons)
- md: 12px (messages, inputs)
- lg: 16px (cards, panels)
- xl: 20px (modals, main window)

---

## Technical Notes for StitchAI

**Framework Target**: React + TypeScript + Tailwind CSS

**Component Structure**:
```
Chatbot/
  ChatWindow.tsx           // Main container
  ChatHeader.tsx           // Header with status
  ChatMessages.tsx         // Message list
  ChatMessage.tsx          // Individual message
  ChatInput.tsx            // Input area
  CommandPreview.tsx       // Preview card
  ConfirmationModal.tsx    // Confirmation dialog
  QuickActions.tsx         // Quick action buttons
  SuggestionChips.tsx      // Suggestion pills
  TypingIndicator.tsx      // Loading dots
```

**State Management**:
- Local component state for UI
- Context for chat history
- API integration hooks ready

**Interaction Patterns**:
- Click quick action → Show specialized panel OR insert command text
- Type message → Send on Enter (Shift+Enter for new line)
- Bot response → Auto-scroll to bottom
- Command preview → Show confirmation → Execute → Show success
- Suggestions → Click inserts as user message

---

## Example User Flows to Design For

### Flow 1: Schedule Appointment
1. User clicks "📅 Schedule Appointment" button
2. Bot responds: "Great! Who is the appointment for?"
3. Shows patient name suggestions
4. User selects "John Doe"
5. Bot: "What treatment does John need?"
6. Shows treatment type buttons
7. User clicks "Dental Cleaning"
8. Bot: "When should I schedule this?"
9. Shows date picker + time slots
10. User selects "March 10, 2pm"
11. Bot shows command preview card
12. User confirms
13. Success message with appointment details

### Flow 2: Natural Language Query
1. User types: "Show me all appointments for tomorrow"
2. Bot processes (typing indicator)
3. Bot responds with rich card showing appointment list
4. Suggestion chips: "Send Reminders", "View Calendar", "Add Appointment"

### Flow 3: Error Handling
1. User types: "Delete patient xyz"
2. Bot: "Patient not found. Did you mean: [suggestions]"
3. User corrects: "Delete patient John Doe"
4. Bot shows warning confirmation modal (red theme)
5. User cancels
6. Bot: "No problem! The patient record is safe."

---

## Design Inspiration References
- Modern SaaS chat widgets (Intercom, Drift)
- AI assistants (ChatGPT, Claude)
- Medical-grade UI (clean, trustworthy, accessible)
- Glass-morphism trends (iOS, Windows 11)

---

## Deliverable Request
Please generate complete HTML/CSS/JS mockups for all 10 interface states listed above, optimized for React component conversion. Focus on:
1. Pixel-perfect spacing and alignment
2. Smooth animations and transitions
3. Responsive behavior
4. Accessibility markup
5. Interactive states (hover, active, disabled, loading)

Each interface should be production-ready and match the DentoFlow brand aesthetic: professional, modern, trustworthy, and user-friendly.
