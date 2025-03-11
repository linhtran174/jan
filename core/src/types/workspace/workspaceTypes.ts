/**
 * Base type for workspace elements
 * @data_transfer_object
 */
export interface WorkspaceElementBase {
  id: string
  type: string
  position?: { x: number; y: number }
  metadata?: Record<string, unknown>
}

/**
 * Canvas element type for visual content in workspace
 * @data_transfer_object
 */
export interface CanvasElement extends WorkspaceElementBase {
  type: "graphic"
  properties: {
    width?: number
    height?: number
    transform?: string
    opacity?: number
  }
  content: string
}

/**
 * Document element type for structured content in workspace
 * @data_transfer_object
 */
export interface DocumentElement extends WorkspaceElementBase {
  type: "doc"
  content: {
    // Common properties
    text?: string
    // Code-specific properties
    language?: string
    // Heading-specific properties
    level?: number
    // List-specific properties
    items?: string[]
    listType?: 'ordered' | 'unordered'
    // Table-specific properties
    columns?: number
    rows?: number
    cells?: string[][]
    // Image-specific properties
    imageUrl?: string
  }
}

/**
 * Type for all workspace elements
 * @data_transfer_object
 */
export type WorkspaceElement = CanvasElement | DocumentElement

/**
 * Workspace view modes
 */
export type WorkspaceMode = 'canvas' | 'document' | 'split'

/**
 * The `WorkspaceContentValue` type defines the shape of a workspace content
 * @data_transfer_object
 */
export type WorkspaceContentValue = {
  workspaceId: string
  version: number
  elements: WorkspaceElement[]
  activeMode: WorkspaceMode
  dimensions: {
    width: number
    height: number
  }
  metadata?: {
    title?: string
    description?: string
    created?: number
    modified?: number
    [key: string]: unknown
  }
}

/**
 * Represents a single state in workspace history
 */
export interface WorkspaceHistoryState {
  version: number
  timestamp: number
  elements: WorkspaceElement[]
  activeMode: WorkspaceMode
}

/**
 * Represents workspace action types for history tracking
 */
export enum WorkspaceActionType {
  ElementAdded = 'element_added',
  ElementModified = 'element_modified',
  ElementRemoved = 'element_removed',
  ModeChanged = 'mode_changed',
  MetadataChanged = 'metadata_changed',
}

/**
 * Represents a workspace action for tracking changes
 */
export interface WorkspaceAction {
  type: WorkspaceActionType
  elementId?: string
  timestamp: number
  payload?: unknown
}

/**
 * Workspace event types for tool operations
 */
export enum WorkspaceEventType {
  WorkspaceCreated = 'workspace_created',
  DocumentElementModified = 'document_element_modified',
  GraphicsElementModified = 'graphics_element_modified'
}

/**
 * Result of workspace operations performed by tools
 */
export interface WorkspaceOperationResult {
  success: boolean;
  error?: string;
  updatedWorkspace?: WorkspaceContentValue;
}

/**
 * Workspace tool request format
 */
export interface WorkspaceToolRequest {
  toolName: string;
  parameters: Record<string, unknown>;
  threadId: string;
  messageId?: string;
}

/**
 * Workspace tool response format
 */
export interface WorkspaceToolResponse {
  success: boolean;
  result?: WorkspaceOperationResult;
  error?: string;
}