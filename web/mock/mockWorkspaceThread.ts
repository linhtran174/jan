import {
  ContentType,
  ChatCompletionRole,
  Thread,
  ThreadMessage,
  ThreadState,
  MessageStatus,
  WorkspaceContentValue,
  WorkspaceMode
} from '@janhq/core'

// Generate a simple ID for mock purposes
const generateId = () => Math.random().toString(36).substring(2, 15)

// Mock workspace content value
const workspaceContentValue: WorkspaceContentValue = {
  workspaceId: "fantasy-story-workspace",
  version: 1,
  elements: [
    {
      id: "text-content-1",
      type: "paragraph",
      content: {
        text: "# The Fantasy World of Jan\n\nIn the digital realm of Bytopia, there existed a powerful assistant named Jan...\n\n## The Beginnings\nJan was created by a team of brilliant engineers who sought to build an AI that could understand and communicate with humans in a natural way...\n\n## The Journey\nAs Jan learned and grew, it developed capabilities beyond what its creators had imagined...\n\n## The Legacy\nToday, Jan continues to evolve, helping users across the world with their tasks and queries..."
      }
    }
  ],
  activeMode: "document" as WorkspaceMode,
  dimensions: {
    width: 800,
    height: 600
  },
  metadata: {
    title: "Jan Fantasy Story",
    description: "A fantasy story about the Jan application",
    created: Date.now(),
    modified: Date.now()
  }
}

// User message asking about Jan
const userMessage: ThreadMessage = {
  id: generateId(),
  object: "thread.message",
  thread_id: "workspace-demo-thread",
  assistant_id: undefined,
  role: ChatCompletionRole.User,
  content: [
    {
      type: ContentType.Text,
      text: {
        value: "Hey, can you create a fantasy story about jan?",
        annotations: []
      }
    }
  ],
  status: MessageStatus.Ready,
  created_at: Date.now() / 1000,
  completed_at: Date.now() / 1000
}

// Assistant response with workspace
const assistantMessage: ThreadMessage = {
  id: generateId(),
  object: "thread.message",
  thread_id: "workspace-demo-thread",
  assistant_id: "jan-assistant",
  role: ChatCompletionRole.Assistant,
  content: [
    {
      type: ContentType.Text,
      text: {
        value: "Sure, this is the fantasy story about the Jan application.",
        annotations: []
      }
    },
    {
      type: ContentType.Workspace,
      workspace: workspaceContentValue
    }
  ],
  status: MessageStatus.Ready,
  created_at: Date.now() / 1000,
  completed_at: Date.now() / 1000
}

// Create a mock thread
export const mockWorkspaceThread: Thread = {
  id: "workspace-demo-thread",
  object: "thread",
  title: "Workspace mockup demo",
  assistants: [
    {
      assistant_id: "jan-assistant",
      assistant_name: "Jan",
      model: {
        id: "demo-model",
        settings: {},
        parameters: {}
      }
    }
  ],
  created: Date.now(),
  updated: Date.now(),
  metadata: {
    title: "Workspace mockup demo",
    updated_at: Date.now(),
    lastMessage: "Sure, this is the fantasy story about the Jan application."
  }
}

// Create thread state
export const mockWorkspaceThreadState: ThreadState = {
  hasMore: false,
  waitingForResponse: false,
  lastMessage: "Sure, this is the fantasy story about the Jan application."
}

// Export the messages
export const mockWorkspaceMessages: ThreadMessage[] = [
  userMessage,
  assistantMessage
]