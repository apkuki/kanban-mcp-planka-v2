# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-30

### Added
- Planka 2.0.0-rc.4 API compatibility
- `createTaskListWithTasks()` - Create checklist with tasks in one operation
- `createTaskInTaskList()` - Create individual task within task list
- `updateTaskInTaskList()` - Update individual task
- `deleteTaskInTaskList()` - Delete individual task
- `create_tasklist_with_tasks` MCP action
- Comprehensive API endpoint documentation
- Version compatibility matrix in README
- This CHANGELOG file

### Changed
- **BREAKING:** Task list endpoints updated to `/api/cards/:cardId/task-lists`
- **BREAKING:** Comments endpoints updated to `/api/cards/:cardId/comments`
- **BREAKING:** `getComment()` now requires `cardId` parameter
- Updated all task operations to use correct Planka 2.0 routes
- Simplified comment retrieval logic
- Enhanced documentation to clarify task lists vs tasks

### Fixed
- Task list creation endpoint (was using non-existent `/tasks` endpoint)
- Comment creation endpoint (was using `/comment-actions` instead of `/comments`)
- Comment reading endpoint (was using `/actions` which returns all activity, not just comments)
- Comment update/delete endpoints (was using `/comment-actions/:id` instead of `/comments/:id`)

### Verified
- All endpoints tested against Planka 2.0.0-rc.4 routes.js
- Projects, boards, lists, cards, labels, memberships already correct
- Build successful
- No regressions

## [1.0.0] - 2024

### Initial Release
- Original MCP server by Brad Risse
- Support for Planka 1.x API
- Basic CRUD operations for projects, boards, lists, cards
- Task management (Planka 1.x style)
- Comment management
- Label management
- Board memberships

---

## Migration Guide: v1.x to v2.0

### Breaking Changes

1. **Task Lists API**
   - Old: Used `/api/cards/{cardId}/tasks`
   - New: Uses `/api/cards/:cardId/task-lists`
   - Action: Update any direct API calls

2. **Comments API**
   - Old: Used `/api/cards/{cardId}/comment-actions` and `/api/comment-actions/:id`
   - New: Uses `/api/cards/:cardId/comments` and `/api/comments/:id`
   - Action: Update comment-related calls

3. **getComment() Function**
   - Old: `getComment(id)`
   - New: `getComment(id, cardId)`
   - Action: Pass cardId when retrieving specific comments

### New Features to Adopt

```typescript
// Before: Create task list, then manually add tasks
const taskList = await createTask({ cardId, name: "Testing" });
// ... then multiple calls to add tasks

// After: Create task list with tasks in one call
const result = await createTaskListWithTasks({
  cardId: "card_id",
  name: "Testing",
  tasks: [
    { name: "Run tests" },
    { name: "Check logs" }
  ]
});
```

### Verification Steps

1. Update to Planka 2.0.0-rc.4 or later
2. Update your MCP client configuration with new repo path
3. Restart your MCP client
4. Test task list creation
5. Test comment operations
6. Verify all existing functionality still works
