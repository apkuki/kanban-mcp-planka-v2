/**
 * @fileoverview Task operations for the MCP Kanban server
 *
 * TERMINOLOGY:
 * - Task List = A checklist on a card (e.g., "Testing Checklist")
 * - Task = An individual checkable item within a task list (e.g., "✓ Verify rate limiting")
 *
 * This module provides functions for interacting with both task lists and tasks in Planka.
 * 
 * Planka API Structure:
 * - POST /api/cards/:cardId/task-lists - Create task list
 * - POST /api/task-lists/:taskListId/tasks - Create task within task list
 * - GET /api/task-lists/:id - Get task list
 * - PATCH /api/task-lists/:id - Update task list
 * - DELETE /api/task-lists/:id - Delete task list
 * - PATCH /api/tasks/:id - Update task
 * - DELETE /api/tasks/:id - Delete task
 */

import { z } from "zod";
import { plankaRequest } from "../common/utils.js";
import { PlankaTaskSchema } from "../common/types.js";

// Schema definitions
/**
 * Schema for creating a new task
 * @property {string} cardId - The ID of the card to create the task in
 * @property {string} name - The name of the task
 * @property {number} [position] - The position of the task in the card (default: 65535)
 */
export const CreateTaskSchema = z.object({
    cardId: z.string().describe("Card ID"),
    name: z.string().describe("Task name"),
    position: z.number().optional().describe("Task position (default: 65535)"),
});

/**
 * Schema for batch creating multiple tasks
 * @property {Array<CreateTaskSchema>} tasks - Array of tasks to create
 */
export const BatchCreateTasksSchema = z.object({
    tasks: z.array(CreateTaskSchema).describe("Array of tasks to create"),
});

/**
 * Schema for retrieving tasks from a card
 * @property {string} cardId - The ID of the card to get tasks from
 */
export const GetTasksSchema = z.object({
    cardId: z.string().describe("Card ID"),
});

/**
 * Schema for retrieving a specific task
 * @property {string} id - The ID of the task to retrieve
 * @property {string} [cardId] - The ID of the card containing the task
 */
export const GetTaskSchema = z.object({
    id: z.string().describe("Task ID"),
    cardId: z.string().optional().describe("Card ID containing the task"),
});

/**
 * Schema for updating a task
 * @property {string} id - The ID of the task to update
 * @property {string} [name] - The new name for the task
 * @property {boolean} [isCompleted] - Whether the task is completed
 * @property {number} [position] - The new position for the task
 */
export const UpdateTaskSchema = z.object({
    id: z.string().describe("Task ID"),
    name: z.string().optional().describe("Task name"),
    isCompleted: z.boolean().optional().describe(
        "Whether the task is completed",
    ),
    position: z.number().optional().describe("Task position"),
});

/**
 * Schema for deleting a task
 * @property {string} id - The ID of the task to delete
 */
export const DeleteTaskSchema = z.object({
    id: z.string().describe("Task ID"),
});

// Type exports
/**
 * Type definition for task creation options
 */
export type CreateTaskOptions = z.infer<typeof CreateTaskSchema>;

/**
 * Type definition for batch task creation options
 */
export type BatchCreateTasksOptions = z.infer<typeof BatchCreateTasksSchema>;

/**
 * Type definition for task update options
 */
export type UpdateTaskOptions = z.infer<typeof UpdateTaskSchema>;

// Response schemas
const TasksResponseSchema = z.object({
    items: z.array(PlankaTaskSchema),
    included: z.record(z.any()).optional(),
});

const TaskResponseSchema = z.object({
    item: PlankaTaskSchema,
    included: z.record(z.any()).optional(),
});

// Map to store task ID to card ID mapping
const taskCardIdMap: Record<string, string> = {};

// Function implementations
/**
 * Creates a new task list (checklist) for a card
 *
 * @param {object} params - The task list creation parameters
 * @param {string} params.cardId - The ID of the card to create the task list in
 * @param {string} params.name - The name of the task list (e.g., "Testing Checklist")
 * @param {number} params.position - The position of the task list in the card
 * @returns {Promise<object>} The created task list
 */
export async function createTask(params: {
    cardId: string;
    name: string;
    position?: number;
}) {
    try {
        const { cardId, name, position = 65535 } = params;

        const response: any = await plankaRequest(
            `/api/cards/${cardId}/task-lists`,
            {
                method: "POST",
                body: { name, position },
            },
        );

        // Store the task list ID to card ID mapping for getTask
        if (response.item && response.item.id) {
            taskCardIdMap[response.item.id] = cardId;
        }

        return response.item;
    } catch (error) {
        console.error("Error creating task list:", error);
        throw new Error(
            `Failed to create task list: ${
                error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}

/**
 * Creates multiple tasks for cards in a single operation
 *
 * @param {BatchCreateTasksOptions} options - The batch create tasks options
 * @returns {Promise<{results: any[], successes: any[], failures: TaskError[]}>} The results of the batch operation
 * @throws {Error} If the batch operation fails completely
 */
export async function batchCreateTasks(options: BatchCreateTasksOptions) {
    try {
        const results: Array<any> = [];
        const successes: Array<any> = [];
        const failures: Array<any> = [];

        /**
         * Interface for task operation result
         * @property {boolean} success - Whether the operation was successful
         * @property {any} [result] - The result of the operation if successful
         * @property {object} [error] - The error if the operation failed
         * @property {string} error.message - The error message
         */
        interface TaskResult {
            success: boolean;
            result?: any;
            error?: { message: string };
        }

        /**
         * Interface for task operation error
         * @property {number} index - The index of the task in the original array
         * @property {CreateTaskOptions} task - The task that failed
         * @property {string} error - The error message
         */
        interface TaskError {
            index: number;
            task: CreateTaskOptions;
            error: string;
        }

        // Process each task in sequence
        for (let i = 0; i < options.tasks.length; i++) {
            const task = options.tasks[i];

            // Ensure position is set if not provided
            if (!task.position) {
                task.position = 65535 * (i + 1);
            }

            try {
                const result = await createTask(task);
                results.push({
                    success: true,
                    result,
                });
                successes.push(result);
            } catch (error) {
                const errorMessage = error instanceof Error
                    ? error.message
                    : String(error);
                results.push({
                    success: false,
                    error: { message: errorMessage },
                });
                failures.push({
                    index: i,
                    task,
                    error: errorMessage,
                });
            }
        }

        return {
            results,
            successes,
            failures,
        };
    } catch (error) {
        throw new Error(
            `Failed to batch create tasks: ${
                error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}

/**
 * Retrieves all task lists for a specific card
 *
 * @param {string} cardId - The ID of the card to get task lists from
 * @returns {Promise<Array<object>>} Array of task lists in the card
 */
export async function getTasks(cardId: string) {
    try {
        // Get the card details which includes task lists
        const response = await plankaRequest(`/api/cards/${cardId}`) as {
            item: any;
            included?: {
                tasks?: any[];
                taskLists?: any[];
            };
        };

        // Extract task lists from the card response (try both field names)
        const taskLists = response?.included?.taskLists || response?.included?.tasks;
        if (taskLists && Array.isArray(taskLists)) {
            return taskLists;
        }

        return [];
    } catch (error) {
        console.error(`Error getting task lists for card ${cardId}:`, error);
        // If there's an error, return an empty array
        return [];
    }
}

/**
 * Retrieves a specific task list by ID
 *
 * @param {string} id - The ID of the task list to retrieve
 * @param {string} [cardId] - Optional card ID to help find the task list
 * @returns {Promise<object>} The requested task list
 */
export async function getTask(id: string, cardId?: string) {
    try {
        // Task lists in Planka are always part of a card, so we need the card ID
        const taskCardId = cardId || taskCardIdMap[id];

        if (!taskCardId) {
            throw new Error(
                "Card ID is required to get a task list. Either provide it directly or create the task list first.",
            );
        }

        // Get the card details which includes task lists
        const response = await plankaRequest(`/api/cards/${taskCardId}`) as {
            item: any;
            included?: {
                tasks?: any[];
                taskLists?: any[];
            };
        };

        const taskLists = response?.included?.taskLists || response?.included?.tasks;
        if (!taskLists || !Array.isArray(taskLists)) {
            throw new Error(`Failed to get task lists for card ${taskCardId}`);
        }

        // Find the task list with the matching ID
        const taskList = taskLists.find((tl: any) =>
            tl.id === id
        );

        if (!taskList) {
            throw new Error(
                `Task list with ID ${id} not found in card ${taskCardId}`,
            );
        }

        return taskList;
    } catch (error) {
        console.error(`Error getting task list with ID ${id}:`, error);
        throw new Error(
            `Failed to get task list: ${
                error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}

/**
 * Updates a task list's properties
 *
 * @param {string} id - The ID of the task list to update
 * @param {Partial<Omit<CreateTaskOptions, "cardId">>} options - The properties to update
 * @returns {Promise<object>} The updated task list
 */
export async function updateTask(
    id: string,
    options: Partial<Omit<CreateTaskOptions, "cardId">>,
) {
    const response = await plankaRequest(`/api/task-lists/${id}`, {
        method: "PATCH",
        body: options,
    });
    const parsedResponse = TaskResponseSchema.parse(response);
    return parsedResponse.item;
}

/**
 * Deletes a task list by ID
 *
 * @param {string} id - The ID of the task list to delete
 * @returns {Promise<{success: boolean}>} Success indicator
 */
export async function deleteTask(id: string) {
    await plankaRequest(`/api/task-lists/${id}`, {
        method: "DELETE",
    });
    return { success: true };
}

/**
 * Creates an individual task within a task list
 *
 * @param {object} params - The task creation parameters
 * @param {string} params.taskListId - The ID of the task list to add the task to
 * @param {string} params.name - The name of the task
 * @param {number} [params.position] - The position of the task (default: 65535)
 * @param {boolean} [params.isCompleted] - Whether the task is completed (default: false)
 * @returns {Promise<object>} The created task
 */
export async function createTaskInTaskList(params: {
    taskListId: string;
    name: string;
    position?: number;
    isCompleted?: boolean;
}) {
    try {
        const { taskListId, name, position = 65535, isCompleted = false } = params;

        const response: any = await plankaRequest(
            `/api/task-lists/${taskListId}/tasks`,
            {
                method: "POST",
                body: { name, position, isCompleted },
            },
        );

        return response.item;
    } catch (error) {
        console.error("Error creating task in task list:", error);
        throw new Error(
            `Failed to create task in task list: ${
                error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}

/**
 * Updates an individual task within a task list
 *
 * @param {string} id - The ID of the task to update
 * @param {object} options - The properties to update
 * @param {string} [options.name] - The name of the task
 * @param {number} [options.position] - The position of the task
 * @param {boolean} [options.isCompleted] - Whether the task is completed
 * @returns {Promise<object>} The updated task
 */
export async function updateTaskInTaskList(
    id: string,
    options: {
        name?: string;
        position?: number;
        isCompleted?: boolean;
    },
) {
    const response = await plankaRequest(`/api/tasks/${id}`, {
        method: "PATCH",
        body: options,
    });
    return (response as any).item;
}

/**
 * Deletes an individual task from a task list
 *
 * @param {string} id - The ID of the task to delete
 * @returns {Promise<{success: boolean}>} Success indicator
 */
export async function deleteTaskInTaskList(id: string) {
    await plankaRequest(`/api/tasks/${id}`, {
        method: "DELETE",
    });
    return { success: true };
}

/**
 * Creates a task list with multiple tasks in one operation
 *
 * @param {object} params - The creation parameters
 * @param {string} params.cardId - The ID of the card to create the task list in
 * @param {string} params.name - The name of the task list (e.g., "Testing")
 * @param {Array<{name: string, isCompleted?: boolean}>} params.tasks - Array of tasks to create
 * @returns {Promise<{taskList: object, tasks: object[]}>} The created task list and tasks
 */
export async function createTaskListWithTasks(params: {
    cardId: string;
    name: string;
    tasks: Array<{ name: string; isCompleted?: boolean }>;
}) {
    try {
        // First create the task list
        const taskList = await createTask({
            cardId: params.cardId,
            name: params.name,
        });

        // Then create all tasks within it
        const createdTasks = [];
        for (let i = 0; i < params.tasks.length; i++) {
            const task = params.tasks[i];
            const createdTask = await createTaskInTaskList({
                taskListId: taskList.id,
                name: task.name,
                position: 65535 * (i + 1),
                isCompleted: task.isCompleted || false,
            });
            createdTasks.push(createdTask);
        }

        return {
            taskList,
            tasks: createdTasks,
        };
    } catch (error) {
        console.error("Error creating task list with tasks:", error);
        throw new Error(
            `Failed to create task list with tasks: ${
                error instanceof Error ? error.message : String(error)
            }`,
        );
    }
}
