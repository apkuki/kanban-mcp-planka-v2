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
- A running Planka 2.0.0-rc.4+ instance
- Planka API token (Bearer token)

### Setup

1. **Clone this repository:**
   ```bash
   git clone https://github.com/apkuki/kanban-mcp-planka-v2.git
   cd kanban-mcp-planka-v2
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```

3. **Configure environment variables:**
   
   Create a `.env` file in the project root:
   ```env
   PLANKA_URL=https://your-planka-instance.com
   PLANKA_TOKEN=your_bearer_token_here
   ```

4. **Build the MCP server:**
   ```bash
   npm run build
   ```

5. **Add to your MCP client configuration:**

   For **Claude Desktop** (`claude_desktop_config.json`):
   ```json
   {
     "mcpServers": {
       "kanban-planka-v2": {
         "command": "node",
         "args": ["/absolute/path/to/kanban-mcp-planka-v2/dist/index.js"],
         "env": {
           "PLANKA_URL": "https://your-planka-instance.com",
           "PLANKA_TOKEN": "your_bearer_token_here"
         }
       }
     }
   }
   ```

   For **Cursor** (`.cursorrules` or settings):
   ```json
   {
     "mcp": {
       "servers": {
         "kanban-planka-v2": {
           "command": "node",
           "args": ["C:\\path\\to\\kanban-mcp-planka-v2\\dist\\index.js"],
           "env": {
             "PLANKA_URL": "https://your-planka-instance.com",
             "PLANKA_TOKEN": "your_bearer_token_here"
           }
         }
       }
     }
   }
   ```

6. **Restart your MCP client** to load the server.

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
- Verify your PLANKA_TOKEN has the correct permissions
- Check that PLANKA_URL doesn't have a trailing slash

### Task lists not working
- This is a Planka 2.0 feature - won't work on Planka 1.x
- Ensure you're using the correct cardId

### Comments returning empty
- Make sure you're using `/api/cards/:cardId/comments` endpoint
- Check that the card actually has comments

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
