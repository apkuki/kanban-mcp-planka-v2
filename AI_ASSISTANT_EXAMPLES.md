# 🤖 AI Assistant Examples for Kanban MCP

This guide provides example instructions and prompts for using the Kanban MCP with popular AI assistants.

---

## 📋 Table of Contents

- [GitHub Copilot (VS Code / Cursor)](#github-copilot-vs-code--cursor)
- [Claude Desktop / Claude Code](#claude-desktop--claude-code)
- [Google Gemini](#google-gemini)
- [Common Workflows](#common-workflows)
- [Best Practices](#best-practices)

---

## 🔧 GitHub Copilot (VS Code / Cursor)

### Initial Setup Prompt

When starting a session with the Kanban MCP:

```
Please connect to my Planka kanban board and show me a summary of the current board status.
Start by listing available projects, then show me the boards and their lists.
```

### Example Workflow Prompts

#### 1. **Starting a New Task**

```
Look at my "Backlog" list, find the highest priority card, and move it to "In Progress". 
Then start the stopwatch on that card and show me its details including any tasks or comments.
```

#### 2. **Creating a Feature Card with Tasks**

```
Create a new card in the Backlog list called "Implement User Authentication" with these tasks:
- Set up authentication middleware
- Create login/logout endpoints
- Add password hashing
- Implement JWT tokens
- Add unit tests
```

#### 3. **Tracking Progress**

```
Show me all cards currently in the "In Progress" list. For each card, display:
- Card name
- Time tracked (stopwatch)
- Completed vs total tasks
- Recent comments
```

#### 4. **Moving Cards Between Boards**

```
Move the card "Bug: Login timeout issue" from the Development board to the Bugs board. 
Make sure to move it to the "To Fix" list on the Bugs board.
Remember: when moving between boards, you need both the target boardId and listId.
```

### Custom Instructions for Copilot

Add this to your `.github/copilot-instructions.md`:

```markdown
## Kanban Board Integration

When working with the Kanban MCP:

1. **Always check board state first** - Before making changes, get a board summary
2. **Card Movement Rules**:
   - Moving within same board: Provide cardId and listId
   - Moving between boards: Provide cardId, listId, AND boardId
   - Moving between projects: Provide cardId, listId, boardId, AND projectId
3. **Use stopwatches** - Start tracking when moving cards to "In Progress"
4. **Document progress** - Add comments when completing major milestones
5. **Task completion** - Check off tasks as you complete implementation steps
```

---

## 🧠 Claude Desktop / Claude Code

### System Prompt / Custom Instructions

Add this to your Claude configuration:

```
# Kanban Board Management

I use Planka for task management via the Kanban MCP. When managing my kanban board:

CRITICAL RULES:
- Moving cards BETWEEN boards requires: id, listId, AND boardId
- Moving cards WITHIN a board requires: id, listId
- Position parameter is optional (defaults to end of list)

WORKFLOW:
1. Check board status before starting work
2. Move cards through: Backlog → In Progress → Testing → Done
3. Start stopwatch when beginning work on a card
4. Create comments to document decisions and progress
5. Complete tasks as work progresses
6. Stop stopwatch when moving to Testing/Done

BEST PRACTICES:
- Always verify IDs before moving cards between boards
- Use descriptive card names and comments
- Break down complex features into task lists
- Label cards by type (bug, feature, enhancement)
```

### Example Prompts for Claude

#### 1. **Daily Standup Report**

```
Generate a daily standup report from my kanban board:
1. Cards completed yesterday (in Done list)
2. Cards currently in progress (with time tracked)
3. Blockers or cards stuck in Testing
4. Next priority items from Backlog
```

#### 2. **Sprint Planning**

```
Help me plan this week's sprint:
1. Show me all cards in Backlog
2. Help me identify 3-5 highest priority items
3. Move selected items to "This Sprint" list
4. Create task breakdowns for each sprint item
5. Add time estimates in comments
```

#### 3. **Bug Triage**

```
Look at all cards with the "bug" label:
1. Group them by board
2. For each bug, show:
   - Card name and description
   - Time in current list
   - Comments (especially error details)
3. Suggest priority order for fixing
```

---

## 💎 Google Gemini

### Gemini Configuration

Configure your Gemini MCP settings with this context:

```json
{
  "context": "Kanban Board Assistant",
  "instructions": [
    "I use Planka kanban boards for project management",
    "When moving cards between different boards, ALWAYS include boardId parameter",
    "When moving cards within the same board, only listId is needed with the card id",
    "Use stopwatch feature to track time on tasks",
    "Create comments to document implementation decisions",
    "Follow agile workflow: Backlog → In Progress → Testing → Done"
  ]
}
```

### Example Prompts for Gemini

#### 1. **Project Overview**

```
Connect to my Planka board and create a comprehensive project overview:
- List all boards and their purposes
- Count cards in each list across all boards
- Identify cards with active stopwatches
- Show cards that have been in "Testing" for more than 3 days
- Highlight any cards without task breakdowns
```

#### 2. **Automated Card Creation from Code Analysis**

```
Analyze the current codebase in this repository and create kanban cards for:
1. TODO comments (create in Backlog)
2. FIXME comments (create as bugs)
3. Deprecated code (create technical debt cards)

For each card:
- Use TODO/FIXME text as description
- Add file path and line number in comments
- Add appropriate labels
- Create tasks for remediation steps
```

#### 3. **Cross-Board Coordination**

```
I have three boards: Frontend, Backend, and DevOps.
Help me coordinate a new feature deployment:

1. Create cards in each board:
   - Frontend: "Add user profile UI"
   - Backend: "Create user profile API endpoints"
   - DevOps: "Deploy profile service"

2. Link them with comments referencing each other
3. Add task breakdowns to each
4. Add labels to show they're part of same feature
```

---

## 🔄 Common Workflows

### Workflow 1: Feature Development Cycle

```
1. Get board summary to see current state
2. Create new feature card in Backlog with task breakdown
3. Move card to In Progress
4. Start stopwatch
5. As you implement:
   - Complete tasks one by one
   - Add comments with implementation notes
   - Add labels for categorization
6. Move to Testing when implementation complete
7. Stop stopwatch
8. After testing, move to Done
```

**Example Prompt:**

```
Let's implement the "Add export feature" card:
1. Find it in Backlog
2. Move to In Progress and start stopwatch
3. Show me the task list
4. As I complete each task, I'll tell you to mark it done
5. Add a comment after each major milestone
```

### Workflow 2: Bug Tracking and Resolution

```
1. Create bug card with description and steps to reproduce
2. Add "bug" label
3. Add to "Bugs" board → "To Fix" list
4. When ready to fix:
   - Move to "In Progress"
   - Start stopwatch
   - Add comment with root cause analysis
5. After fix:
   - Move to "Testing"
   - Add comment with fix description and testing steps
6. After verification:
   - Move to "Done"
   - Stop stopwatch
```

### Workflow 3: Sprint Management

```
Weekly sprint setup:
1. Get all Backlog items
2. Prioritize top 5-7 items
3. Create "Sprint Week XX" list
4. Move selected items to sprint list
5. Add task breakdowns to each item
6. Add time estimates in comments

Daily updates:
- Check In Progress items
- Update task completion
- Add progress comments
- Move completed items to Done
- Pull next item from sprint list if capacity available
```

---

## ✅ Best Practices

### 1. **Always Verify IDs When Moving Cards**

❌ **Wrong:**
```
Move card "Fix login bug" to Testing list
(AI might guess wrong listId or forget boardId)
```

✅ **Right:**
```
Show me the Testing list ID, then move card "Fix login bug" to that list.
If it's on a different board, make sure to include the boardId.
```

### 2. **Use Structured Task Creation**

❌ **Wrong:**
```
Create a card for user authentication
```

✅ **Right:**
```
Create a card "Implement User Authentication" with these tasks:
- Research authentication strategies
- Set up auth middleware
- Implement login endpoint
- Implement logout endpoint
- Add JWT handling
- Write tests
```

### 3. **Track Time Consistently**

```
When moving to In Progress: Start stopwatch
When moving to Testing/Done: Stop stopwatch
When resuming work: Restart stopwatch
```

### 4. **Document Decisions in Comments**

```
After making architectural decisions, have the AI add a comment:
"Add a comment to the current card documenting why we chose JWT over sessions:
- Stateless authentication
- Better for microservices
- Easier horizontal scaling"
```

### 5. **Use Labels for Organization**

Common label structure:
- **Type**: bug, feature, enhancement, technical-debt
- **Priority**: critical, high, medium, low
- **Status**: blocked, waiting-review, ready-to-deploy
- **Area**: frontend, backend, database, devops

### 6. **Batch Related Operations**

✅ **Efficient:**
```
Create these three related cards in the Backlog:
1. "Design user profile schema" 
2. "Implement profile API"
3. "Build profile UI"

Link them by adding comments referencing each other's IDs.
```

### 7. **Regular Board Maintenance**

Weekly prompt:
```
Help me clean up the board:
1. Show cards in Done for more than 2 weeks (consider archiving)
2. Show cards in Testing for more than 5 days (might be blocked)
3. Show cards without task breakdowns
4. Show cards without labels
```

---

## 🎯 Quick Reference Commands

### Get Board Status
```
Show me a summary of the [Board Name] board
```

### Create Card with Tasks
```
Create card "[Card Name]" in [List Name] with tasks: [task1, task2, task3]
```

### Move Card Within Board
```
Move card "[Card Name]" to [List Name] list
```

### Move Card Between Boards
```
Move card "[Card Name]" from [Current Board] to [Target Board] → [Target List]
Remember to include the boardId!
```

### Start Work on Card
```
Move "[Card Name]" to In Progress and start the stopwatch
```

### Complete Work
```
Move "[Card Name]" to Done and stop the stopwatch
```

### Add Progress Note
```
Add a comment to "[Card Name]": [your comment text]
```

### Create Bug Report
```
Create a bug card in [Board] → [List]:
Title: [Bug title]
Description: [Steps to reproduce, expected vs actual behavior]
Label: bug
```

---

## 🚀 Advanced Usage

### Template Card Creation

```
Create a template card for new features:
1. Create card "Feature Template - DO NOT DELETE"
2. Add standard tasks:
   - Requirements gathering
   - Design review
   - Implementation
   - Unit tests
   - Integration tests
   - Documentation
   - Code review
   - Deploy to staging
   - QA testing
   - Deploy to production

When starting new features, duplicate this template and rename it.
```

### Automated Reporting

```
Every Friday, generate a weekly report:
1. Cards completed this week (moved to Done)
2. Total time tracked across all cards
3. Cards still in progress
4. Blocked cards (in Testing > 3 days)
5. Next week's priorities (top of Backlog)

Format as markdown and save to weekly-reports/YYYY-MM-DD.md
```

### Cross-Repository Integration

```
When I push code:
1. Find the card I'm working on (In Progress + stopwatch running)
2. Add a comment with:
   - Commit SHA
   - Files changed
   - Brief summary of changes
3. If commit message contains "fixes" or "closes", mark relevant tasks complete
```

---

**💡 Tip:** Bookmark this file and share these examples with your team to ensure consistent kanban board usage across all AI assistants!
