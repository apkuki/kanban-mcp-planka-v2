# Kanban MCP for Planka 2.x

> **Model Context Protocol (MCP) server for Planka 2.0.0-rc.4 and later**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ⚠️ Version Compatibility

This MCP server is specifically designed for **Planka 2.0.0-rc.4 and later versions**.

| Planka Version | Compatible MCP Repository |
|----------------|---------------------------|
| **2.0.0-rc.4+** | **This repository** ([apkuki/kanban-mcp-planka-v2](https://github.com/apkuki/kanban-mcp-planka-v2)) |
| 1.x | [bradrisse/kanban-mcp](https://github.com/bradrisse/kanban-mcp) (original) |

**Why a separate repo?** Planka 2.0 introduced significant API changes that are incompatible with version 1.x. Rather than breaking the original MCP for existing users, this fork maintains compatibility with Planka 2.x.

---

## 🎯 Features

### Core Functionality
- ✅ **Projects & Boards** - Full CRUD operations
- ✅ **Lists** - Create, read, update, delete board lists
- ✅ **Cards** - Complete card management with all metadata
- ✅ **Task Lists & Tasks** - Create checklists with checkbox items
- ✅ **Comments** - Add, update, delete card comments
- ✅ **Labels** - Full label management with 25 color options
- ✅ **Board Memberships** - Manage user access to boards
- ✅ **Stopwatch** - Time tracking on cards

### Enhanced Features
- 🆕 **Batch Operations** - Create multiple items in one call
- 🆕 **Task List with Tasks** - Create checklists with items in one operation
- 🆕 **Board Summaries** - Get comprehensive board overviews
- 🆕 **Card Details** - Fetch complete card information with related data

---

## 🚀 Installation

### Prerequisites
- Node.js 18+ or Bun
- Docker (if running Planka locally)
- A Planka 2.0.0-rc.4+ instance (either existing or new)

---

### Option A: Connect to Existing Planka Instance

**Use this if you already have Planka running** (e.g., on a server or different machine).

1. **Clone and build:**
   ```bash
   git clone https://github.com/apkuki/kanban-mcp-planka-v2.git
   cd kanban-mcp-planka-v2
   npm install
   npm run build
   ```

2. **Configure your MCP client:**

   For **Claude Desktop** (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "kanban-planka-v2": {
         "command": "node",
         "args": ["/absolute/path/to/kanban-mcp-planka-v2/dist/index.js"],
         "env": {
           "PLANKA_BASE_URL": "http://localhost:3333",
           "PLANKA_AGENT_EMAIL": "your-email@example.com",
           "PLANKA_AGENT_PASSWORD": "your-password"
         }
       }
     }
   }
   ```
   
   **Replace values:**
   - Path: Your actual path to the `dist/index.js` file
   - URL: `http://localhost:3333` for local Planka, or your server URL (e.g., `https://planka.yourcompany.com`)
   - Email/Password: Credentials of an existing Planka user

   For **Cursor** (`.cursor/mcp.json` or global settings):
   ```json
   {
     "mcpServers": {
       "kanban-planka-v2": {
         "command": "node",
         "args": ["/absolute/path/to/kanban-mcp-planka-v2/dist/index.js"],
         "env": {
           "PLANKA_BASE_URL": "http://localhost:3333",
           "PLANKA_AGENT_EMAIL": "your-email@example.com",
           "PLANKA_AGENT_PASSWORD": "your-password"
         }
       }
     }
   }
   ```
   
   **Note:** On Windows, use forward slashes `/` in the path, or escape backslashes like `C:\\path\\to\\file.js`

   For **GitHub Copilot CLI** (`~/.mcp/mcp-config.json`):
   ```json
   {
     "mcpServers": {
       "kanban-planka-v2": {
         "command": "node",
         "args": ["/absolute/path/to/kanban-mcp-planka-v2/dist/index.js"],
         "env": {
           "PLANKA_BASE_URL": "http://localhost:3333",
           "PLANKA_AGENT_EMAIL": "your-email@example.com",
           "PLANKA_AGENT_PASSWORD": "your-password"
         }
       }
     }
   }
   ```

3. **Restart your MCP client** to load the server.

---

### Option B: Run Planka + MCP Together (Docker)

**Use this if you want to run Planka locally** in Docker alongside the MCP server.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/apkuki/kanban-mcp-planka-v2.git
   cd kanban-mcp-planka-v2
   npm install
   ```

2. **Configure environment variables:**
   
   Edit the `.env` file in the project root:
   ```env
   # Planka Configuration
   PLANKA_PORT=3333
   BASE_URL=http://localhost:3333
   SECRET_KEY=your-secret-key-here
   
   # Admin User (created on first run)
   PLANKA_ADMIN_EMAIL=admin@example.com
   PLANKA_ADMIN_PASSWORD=your-secure-password
   PLANKA_ADMIN_NAME=Admin User
   PLANKA_ADMIN_USERNAME=admin
   
   # PostgreSQL Configuration
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=postgres
   POSTGRES_DB=planka
   
   # MCP-Kanban Configuration
   MCP_KANBAN_PORT=3008
   PLANKA_BASE_URL=http://planka:${PLANKA_PORT}
   PLANKA_AGENT_EMAIL=${PLANKA_ADMIN_EMAIL}
   PLANKA_AGENT_PASSWORD=${PLANKA_ADMIN_PASSWORD}
   ```

   **Important variables:**
   - `PLANKA_ADMIN_EMAIL` - The email for your Planka admin user
   - `PLANKA_ADMIN_PASSWORD` - Password for the admin user
   - `SECRET_KEY` - Change this to a random string for security
   - `PLANKA_BASE_URL` - URL where Planka is accessible

3. **Build the MCP server:**
   ```bash
   npm run build
   ```

4. **Start Planka in Docker:**
   ```bash
   npm run up
   # or
   docker compose up -d
   ```

5. **Access Planka:**
   - Open http://localhost:3333 in your browser
   - Login with the credentials you set in `.env`

6. **Configure your MCP client:**

   Use the same configuration as Option A, but with:
   ```json
   "env": {
     "PLANKA_BASE_URL": "http://localhost:3333",
     "PLANKA_AGENT_EMAIL": "admin@example.com",
     "PLANKA_AGENT_PASSWORD": "your-secure-password"
   }
   ```

7. **Restart your MCP client.**

---

### 🔑 Authentication Notes

- **PLANKA_BASE_URL**: The base URL of your Planka instance (no trailing slash)
- **PLANKA_AGENT_EMAIL**: Email of a Planka user (must exist in Planka)
- **PLANKA_AGENT_PASSWORD**: Password for that user
- The MCP server logs in as this user and performs all operations on their behalf

---

## 📚 Usage Examples

### Task Lists (Checklists)

```typescript
// Create a checklist with tasks in one operation
kanban-mcp_kanban_task_manager({
  action: "create_tasklist_with_tasks",
  cardId: "card_id_here",
  name: "Testing Checklist",
  tasks: [
    { name: "□ Run unit tests" },
    { name: "□ Run integration tests" },
    { name: "□ Update documentation" }
  ]
})

// Get all task lists for a card
kanban-mcp_kanban_task_manager({
  action: "get_all",
  cardId: "card_id_here"
})
```

### Comments

```typescript
// Create a comment
kanban-mcp_kanban_comment_manager({
  action: "create",
  cardId: "card_id_here",
  text: "Implementation complete, ready for review"
})

// Get all comments
kanban-mcp_kanban_comment_manager({
  action: "get_all",
  cardId: "card_id_here"
})
```

### Cards

```typescript
// Create a card
kanban-mcp_kanban_card_manager({
  action: "create",
  listId: "list_id_here",
  name: "New Feature",
  description: "Implement new feature X"
})

// Get card details with related data
kanban-mcp_kanban_card_manager({
  action: "get_details",
  cardId: "card_id_here"
})
```

### Labels

```typescript
// Add label to card
kanban-mcp_kanban_label_manager({
  action: "add_to_card",
  cardId: "card_id_here",
  labelId: "label_id_here"
})
```

---

## 🤖 AI-Assisted Workflow Example

This MCP server enables seamless integration with AI assistants like **GitHub Copilot CLI** or **Claude Desktop** for managing your development workflow through Planka.

### Two-Board System: Backlog + Worklog

A proven workflow pattern using two boards to organize issues from planning to completion:

```
📋 BACKLOG BOARD                        📊 WORKLOG BOARD
├── Architecture (ARCH-xxx)            ├── Planned (ready to build)
├── Security (SEC-xxx)                 ├── In Progress (actively working)
├── Performance (PERF-xxx)             ├── Testing (awaiting verification)
└── Feature (FEAT-xxx)                 └── Completed (done)
```

**Labels:**
- **Priority:** `Critical` (red) | `High` (orange) | `Normal` (yellow)
- **Status is tracked by board position** (which list the card is in)

---

### Example AI Workflow Instructions

Copy this into your AI assistant's custom instructions (e.g., GitHub Copilot `.github/copilot-instructions.md` or Claude's project instructions):

```markdown
# Kanban Workflow with MCP

## Board Structure
- **Backlog Board** (ID: `your_backlog_board_id`)
  - Lists: Architecture, Security, Performance, Feature
  - Issues with priority labels only (Critical/High/Normal)
  
- **Worklog Board** (ID: `your_worklog_board_id`)
  - Lists: Planned, In Progress, Testing, Completed
  - Issues with priority labels (status = which list they're in)

## Workflow Phases

### 1️⃣ Creating New Issues
When discovering work that needs to be done:
1. Create card in appropriate Backlog board list (Architecture/Security/Performance/Feature)
2. Add priority label: Critical/High/Normal
3. Write brief description of the issue
4. Get card URL and track in your project documentation

**Example:**
```javascript
// Create security issue in Backlog
kanban-mcp_kanban_card_manager({
  action: "create",
  listId: "security_list_id",
  name: "SEC-001: Missing rate limiting on login endpoint",
  description: "Login endpoint vulnerable to brute force attacks"
})

// Add priority label
kanban-mcp_kanban_label_manager({
  action: "add_to_card",
  cardId: "new_card_id",
  labelId: "critical_label_id"
})
```

### 2️⃣ Planning Phase
When user says "plan issue XYZ":
1. **Read card fresh** from Planka (user may have edited)
2. Analyze codebase to understand scope
3. **Write implementation plan** to card description:
   ```markdown
   ## Implementation Plan
   
   ### Summary
   Brief approach overview
   
   ### Steps
   1. Step one with details
   2. Step two with details
   
   ### Files to Modify
   - `path/to/file.ts` - what changes
   
   ### Testing Notes
   - How to verify
   ```
4. **Move card** to Worklog board → "Planned" list
5. Add comment: "Plan created on {date}"

**Example:**
```javascript
// Update card description with plan
kanban-mcp_kanban_card_manager({
  action: "update",
  id: "card_id",
  description: "## Implementation Plan\n\n### Summary\n..."
})

// Move to Planned list
kanban-mcp_kanban_card_manager({
  action: "move",
  id: "card_id",
  listId: "planned_list_id",
  boardId: "worklog_board_id"
})

// Add comment
kanban-mcp_kanban_comment_manager({
  action: "create",
  cardId: "card_id",
  text: "Plan created on 2026-01-30"
})
```

### 3️⃣ Implementation Phase
When user says "build issue XYZ":
1. **Sync first** - read card fresh from Planka
2. Move to "In Progress" list
3. Implement according to plan
4. Add progress comments as you work
5. When complete, **move to "Testing" list**
6. **Create Testing task list** with verification steps

**Example:**
```javascript
// Move to In Progress
kanban-mcp_kanban_card_manager({
  action: "move",
  id: "card_id",
  listId: "in_progress_list_id"
})

// Add progress comment
kanban-mcp_kanban_comment_manager({
  action: "create",
  cardId: "card_id",
  text: "✅ Phase 1 complete: Database schema updated"
})

// When implementation done, move to Testing
kanban-mcp_kanban_card_manager({
  action: "move",
  id: "card_id",
  listId: "testing_list_id"
})

// CRITICAL: Add testing checklist
kanban-mcp_kanban_task_manager({
  action: "create_tasklist_with_tasks",
  cardId: "card_id",
  name: "Testing",
  tasks: [
    { name: "Verify feature works as expected" },
    { name: "Run npm run build (confirm success)" },
    { name: "Run npm run test (confirm passing)" },
    { name: "Manual testing of edge cases" },
    { name: "Verify no regressions" },
    { name: "Update documentation if needed" }
  ]
})
```

### 4️⃣ Completion Phase
After user completes testing:
1. User checks off all testing tasks in Planka
2. User moves card to "Completed" list
3. Update project documentation with completion date

---

## Key Rules

### Always Sync Before Working
**Before starting any work on a card, ALWAYS:**
- Read the card fresh from Planka (may have been edited)
- Check current board position (which list it's in)
- Read all comments for updates

### Two-Level Task Hierarchy
- **Task List** = Container (e.g., "Testing Checklist")
- **Task** = Individual checkbox item (e.g., "☐ Run tests")

Use `create_tasklist_with_tasks` to create proper hierarchy.

### Testing Checklist is Mandatory
When moving to Testing list, ALWAYS create a "Testing" task list with verification steps.

### Comments for Progress
Add comments to cards as you complete major steps for transparency.
```

---

### Real-World Example

Here's how an AI assistant would handle the complete lifecycle:

```
User: "Create a new security issue for missing rate limiting"
AI: → Creates card in Backlog → Security list
    → Adds "Critical" label
    → Returns card URL

User: "Plan SEC-015"
AI: → Reads card from Planka
    → Analyzes codebase
    → Writes implementation plan to card description
    → Moves to Worklog → Planned
    → Adds comment: "Plan created"

User: "Build SEC-015"
AI: → Reads card fresh (checks for updates)
    → Moves to Worklog → In Progress
    → Implements rate limiting
    → Adds comments for each phase
    → Moves to Worklog → Testing
    → Creates Testing task list with 6 verification tasks

User: [completes testing tasks in Planka]
    → Checks all boxes
    → Moves to Completed list
    → AI updates project docs with completion date
```

---

### Benefits

✅ **Transparent Progress** - All stakeholders see real-time status in Planka  
✅ **AI-Readable Context** - AI reads cards to understand current state  
✅ **Async Collaboration** - Team can edit cards, AI syncs before working  
✅ **Audit Trail** - Comments and task lists document the journey  
✅ **Testing Accountability** - Explicit checklist before marking complete  

---

## 🔧 Available Tools

| Tool | Description |
|------|-------------|
| `mcp_kanban_project_board_manager` | Manage projects and boards |
| `mcp_kanban_list_manager` | Manage board lists |
| `mcp_kanban_card_manager` | Manage cards |
| `mcp_kanban_task_manager` | Manage task lists and tasks |
| `mcp_kanban_label_manager` | Manage labels |
| `mcp_kanban_comment_manager` | Manage card comments |
| `mcp_kanban_membership_manager` | Manage board memberships |
| `mcp_kanban_stopwatch` | Track time on cards |

---

## 📝 What's New in This Version?

### Planka 2.0 API Compatibility (2026-01-30)

**Fixed Issues:**
- ✅ Updated task lists endpoints (`/api/cards/:cardId/task-lists`)
- ✅ Added support for individual tasks within task lists (`/api/task-lists/:taskListId/tasks`)
- ✅ Fixed comments endpoints (`/api/cards/:cardId/comments` instead of `/comment-actions`)
- ✅ All API endpoints verified against Planka 2.0.0-rc.4 routes

**New Features:**
- 🆕 `create_tasklist_with_tasks` - Create checklist with items in one call
- 🆕 Individual task management functions
- 🆕 Simplified comment operations
- 🆕 Comprehensive documentation

**Breaking Changes from Original:**
- Task list creation now correctly uses `/task-lists` endpoint
- Comments require `cardId` for retrieval
- All endpoints updated to match Planka 2.0 API structure

---

## 🏗️ Architecture

### Planka 2.0 Data Model

```
Project
  └── Board
      ├── List
      │   └── Card
      │       ├── Task List (Checklist)
      │       │   └── Task (Checkbox item)
      │       ├── Comment
      │       ├── Label
      │       ├── Attachment
      │       └── Card Membership
      ├── Label
      └── Board Membership
```

### Key Concepts

**Task Lists vs Tasks:**
- **Task List** = A checklist on a card (e.g., "Testing Checklist")
- **Task** = An individual checkbox item within a task list (e.g., "✓ Run tests")

**Comments vs Actions:**
- **Comments** = User-created comments on cards
- **Actions** = Activity log (includes comments + system events)

---

## 🧪 Development

### Running Tests
```bash
npm test
```

### Building
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

---

## 🐛 Troubleshooting

### "Resource not found" errors
- Ensure your Planka instance is version 2.0.0-rc.4 or later
- Verify `PLANKA_AGENT_EMAIL` and `PLANKA_AGENT_PASSWORD` are correct
- Check that the user exists in Planka and can login
- Check that `PLANKA_BASE_URL` doesn't have a trailing slash

### Task lists not working
- This is a Planka 2.0 feature - won't work on Planka 1.x
- Ensure you're using the correct cardId

### Connection errors
- Verify `PLANKA_BASE_URL` is accessible from where the MCP server runs
- If Planka is on `localhost` and MCP is in Docker, use `http://host.docker.internal:3333`
- Check firewall settings if connecting to remote Planka instance

### Authentication failures
- Double-check email and password match a valid Planka user
- Try logging in to Planka web interface with the same credentials
- Check Planka logs for authentication errors

---

## 📋 API Endpoint Reference

### Planka 2.0.0-rc.4 Endpoints Used

```
# Projects & Boards
GET    /api/projects
POST   /api/projects/:projectId/boards
GET    /api/boards/:id

# Lists & Cards
POST   /api/boards/:boardId/lists
POST   /api/lists/:listId/cards
GET    /api/cards/:id

# Task Lists & Tasks
POST   /api/cards/:cardId/task-lists
POST   /api/task-lists/:taskListId/tasks
PATCH  /api/task-lists/:id
PATCH  /api/tasks/:id

# Comments
GET    /api/cards/:cardId/comments
POST   /api/cards/:cardId/comments
PATCH  /api/comments/:id

# Labels
POST   /api/boards/:boardId/labels
POST   /api/cards/:cardId/card-labels
DELETE /api/cards/:cardId/card-labels/labelId::labelId

# Memberships
POST   /api/boards/:boardId/board-memberships
PATCH  /api/board-memberships/:id
```

**Official Planka API Documentation:** https://plankanban.github.io/planka/swagger-ui/

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork this repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines
- Ensure all endpoints match Planka 2.0+ API
- Add tests for new features
- Update documentation
- Follow existing code style

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details

---

## 🙏 Credits

- **Original MCP Server:** [bradrisse/kanban-mcp](https://github.com/bradrisse/kanban-mcp)
- **Planka Project:** [plankanban/planka](https://github.com/plankanban/planka)
- **Planka 2.0 Compatibility:** Updates by [@apkuki](https://github.com/apkuki)

---

## 📞 Support

- **Issues:** [GitHub Issues](https://github.com/apkuki/kanban-mcp-planka-v2/issues)
- **Planka Discord:** [Join the community](https://discord.gg/planka)
- **Documentation:** See the [wiki](https://github.com/apkuki/kanban-mcp-planka-v2/wiki)

---

## 🗺️ Roadmap

- [ ] Add attachment support (file uploads)
- [ ] Add custom fields support
- [ ] Add card duplication
- [ ] Add notification management
- [ ] Improve error handling and retries
- [ ] Add rate limiting for API calls
- [ ] Add caching layer for performance

---

**Made with ❤️ for the Planka community**
