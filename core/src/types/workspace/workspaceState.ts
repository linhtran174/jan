import { ulid } from 'ulidx'
import {
  WorkspaceContentValue,
  WorkspaceElement,
  WorkspaceHistoryState,
  WorkspaceAction,
  WorkspaceActionType,
  WorkspaceMode,
  CanvasElement,
  DocumentElement
} from './workspaceTypes'

/**
 * Class for managing workspace state and operations
 */
export class WorkspaceStateManager {
  private workspaceId: string
  private version: number
  private elements: WorkspaceElement[]
  private activeMode: WorkspaceMode
  private dimensions: {
    width: number
    height: number
  }
  private metadata: Record<string, unknown>
  private history: WorkspaceHistoryState[]
  private actions: WorkspaceAction[]
  
  /**
   * Create a new workspace state manager
   * @param initialState Optional initial state for the workspace
   */
  constructor(initialState?: Partial<WorkspaceContentValue>) {
    this.workspaceId = initialState?.workspaceId || ulid()
    this.version = initialState?.version || 1
    this.elements = initialState?.elements || []
    this.activeMode = initialState?.activeMode || 'canvas'
    this.dimensions = initialState?.dimensions || { width: 1200, height: 800 }
    this.metadata = initialState?.metadata || {
      title: 'Untitled Workspace',
      created: Date.now(),
      modified: Date.now()
    }
    this.history = []
    this.actions = []
    
    // Initialize with first history state
    this.saveHistoryState()
  }
  
  /**
   * Get the current workspace content value
   */
  public getWorkspaceContent(): WorkspaceContentValue {
    return {
      workspaceId: this.workspaceId,
      version: this.version,
      elements: [...this.elements], // Return copy to prevent direct mutation
      activeMode: this.activeMode,
      dimensions: { ...this.dimensions },
      metadata: { ...this.metadata }
    }
  }
  
  /**
   * Add a new canvas element to the workspace
   * @param element The canvas element to add (without ID)
   * @returns The added element with generated ID
   */
  public addCanvasElement(element: Omit<CanvasElement, 'id'>): CanvasElement {
    const newElement: CanvasElement = {
      ...element,
      id: ulid()
    }
    
    this.elements.push(newElement)
    this.recordAction({
      type: WorkspaceActionType.ElementAdded,
      elementId: newElement.id,
      timestamp: Date.now(),
      payload: newElement
    })
    
    this.updateVersion()
    return newElement
  }

  /**
   * Add a new document element to the workspace
   * @param element The document element to add (without ID)
   * @returns The added element with generated ID
   */
  public addDocumentElement(element: Omit<DocumentElement, 'id'>): DocumentElement {
    const newElement: DocumentElement = {
      ...element,
      id: ulid()
    }
    
    this.elements.push(newElement)
    this.recordAction({
      type: WorkspaceActionType.ElementAdded,
      elementId: newElement.id,
      timestamp: Date.now(),
      payload: newElement
    })
    
    this.updateVersion()
    return newElement
  }
  
  /**
   * Get element by ID
   * @param elementId ID of the element to find
   * @returns The element if found, undefined otherwise
   */
  public getElementById(elementId: string): WorkspaceElement | undefined {
    return this.elements.find(e => e.id === elementId);
  }
  
  /**
   * Check if element is a canvas element
   * @param element Element to check
   */
  private isCanvasElement(element: WorkspaceElement): element is CanvasElement {
    return ['shape', 'drawing', 'image', 'text'].includes(element.type as string);
  }
  
  /**
   * Check if element is a document element
   * @param element Element to check
   */
  private isDocumentElement(element: WorkspaceElement): element is DocumentElement {
    return ['paragraph', 'code', 'heading', 'list', 'table', 'image'].includes(element.type as string);
  }
  
  /**
   * Update an existing canvas element
   * @param elementId ID of the element to update
   * @param updates Updates to apply
   * @returns Updated element or undefined if not found or not a canvas element
   */
  public updateCanvasElement(
    elementId: string,
    updates: Partial<Omit<CanvasElement, 'id' | 'type'>>
  ): CanvasElement | undefined {
    const elementIndex = this.elements.findIndex(e => e.id === elementId)
    
    if (elementIndex === -1) {
      return undefined
    }
    
    const element = this.elements[elementIndex]
    
    if (!this.isCanvasElement(element)) {
      return undefined
    }
    
    const updatedElement: CanvasElement = {
      ...element,
      ...updates
    }
    
    this.elements[elementIndex] = updatedElement
    
    this.recordAction({
      type: WorkspaceActionType.ElementModified,
      elementId,
      timestamp: Date.now(),
      payload: updates
    })
    
    this.updateVersion()
    return updatedElement
  }
  
  /**
   * Update an existing document element
   * @param elementId ID of the element to update
   * @param updates Updates to apply
   * @returns Updated element or undefined if not found or not a document element
   */
  public updateDocumentElement(
    elementId: string,
    updates: Partial<Omit<DocumentElement, 'id' | 'type'>>
  ): DocumentElement | undefined {
    const elementIndex = this.elements.findIndex(e => e.id === elementId)
    
    if (elementIndex === -1) {
      return undefined
    }
    
    const element = this.elements[elementIndex]
    
    if (!this.isDocumentElement(element)) {
      return undefined
    }
    
    const updatedElement: DocumentElement = {
      ...element,
      ...updates
    }
    
    this.elements[elementIndex] = updatedElement
    
    this.recordAction({
      type: WorkspaceActionType.ElementModified,
      elementId,
      timestamp: Date.now(),
      payload: updates
    })
    
    this.updateVersion()
    return updatedElement
  }
  
  /**
   * Remove an element from the workspace
   * @param elementId ID of the element to remove
   * @returns True if element was removed, false if not found
   */
  public removeElement(elementId: string): boolean {
    const elementIndex = this.elements.findIndex(e => e.id === elementId)
    
    if (elementIndex === -1) {
      return false
    }
    
    const removedElement = this.elements[elementIndex]
    this.elements.splice(elementIndex, 1)
    
    this.recordAction({
      type: WorkspaceActionType.ElementRemoved,
      elementId,
      timestamp: Date.now(),
      payload: removedElement
    })
    
    this.updateVersion()
    return true
  }
  
  /**
   * Change the active mode of the workspace
   * @param mode The new mode
   */
  public changeMode(mode: WorkspaceMode): void {
    if (this.activeMode !== mode) {
      const previousMode = this.activeMode
      this.activeMode = mode
      
      this.recordAction({
        type: WorkspaceActionType.ModeChanged,
        timestamp: Date.now(),
        payload: {
          previousMode,
          newMode: mode
        }
      })
      
      this.updateVersion()
    }
  }
  
  /**
   * Update workspace metadata
   * @param updates Metadata updates
   */
  public updateMetadata(updates: Record<string, unknown>): void {
    const previousMetadata = { ...this.metadata }
    
    this.metadata = {
      ...this.metadata,
      ...updates,
      modified: Date.now()
    }
    
    this.recordAction({
      type: WorkspaceActionType.MetadataChanged,
      timestamp: Date.now(),
      payload: {
        previousMetadata,
        updates
      }
    })
    
    this.updateVersion()
  }
  
  /**
   * Update workspace dimensions
   * @param dimensions New dimensions
   */
  public updateDimensions(dimensions: { width: number; height: number }): void {
    this.dimensions = { ...dimensions }
    this.updateVersion()
  }
  
  /**
   * Get workspace version history
   */
  public getHistory(): WorkspaceHistoryState[] {
    return [...this.history]
  }
  
  /**
   * Get workspace action history
   */
  public getActions(): WorkspaceAction[] {
    return [...this.actions]
  }
  
  /**
   * Restore workspace to a specific version
   * @param version The version to restore to
   * @returns Whether the restore was successful
   */
  public restoreVersion(version: number): boolean {
    const historyState = this.history.find(state => state.version === version)
    
    if (!historyState) {
      return false
    }
    
    this.elements = [...historyState.elements]
    this.activeMode = historyState.activeMode
    this.version = version
    
    // Update the modified timestamp
    this.metadata = {
      ...this.metadata,
      modified: Date.now()
    }
    
    return true
  }
  
  /**
   * Create a new workspace with default settings
   * @param options Optional settings for the new workspace
   */
  public static createWorkspace(
    options?: {
      title?: string
      mode?: WorkspaceMode
      dimensions?: { width: number; height: number }
    }
  ): WorkspaceStateManager {
    return new WorkspaceStateManager({
      metadata: {
        title: options?.title || 'Untitled Workspace',
        created: Date.now(),
        modified: Date.now()
      },
      activeMode: options?.mode || 'canvas',
      dimensions: options?.dimensions || { width: 1200, height: 800 }
    })
  }
  
  /**
   * Load a workspace from serialized content
   * @param content The workspace content
   */
  public static loadFromContent(content: WorkspaceContentValue): WorkspaceStateManager {
    return new WorkspaceStateManager(content)
  }
  
  /**
   * Import a workspace from a JSON string
   * @param json JSON string representation of workspace
   * @returns New workspace manager instance or null if invalid
   */
  public static importFromJson(json: string): WorkspaceStateManager | null {
    try {
      const content = JSON.parse(json) as WorkspaceContentValue
      return new WorkspaceStateManager(content)
    } catch (error) {
      console.error('Failed to import workspace:', error)
      return null
    }
  }
  
  /**
   * Export workspace to JSON
   * @returns JSON string representation of workspace
   */
  public exportToJson(): string {
    return JSON.stringify(this.getWorkspaceContent())
  }
  
  /**
   * Record an action in the action history
   * @param action The action to record
   */
  private recordAction(action: WorkspaceAction): void {
    this.actions.push(action)
  }
  
  /**
   * Save current state to history and increment version
   */
  private updateVersion(): void {
    this.version += 1
    this.metadata = {
      ...this.metadata,
      modified: Date.now()
    }
    
    this.saveHistoryState()
  }
  
  /**
   * Save current state to history
   */
  private saveHistoryState(): void {
    // Limit history size to prevent memory issues
    if (this.history.length >= 50) {
      this.history.shift() // Remove oldest state
    }
    
    this.history.push({
      version: this.version,
      timestamp: Date.now(),
      elements: [...this.elements],
      activeMode: this.activeMode
    })
  }
}

/**
 * Factory function to create a new workspace
 * @param options Optional settings for the new workspace
 */
export function createWorkspace(
  options?: {
    title?: string
    mode?: WorkspaceMode
    dimensions?: { width: number; height: number }
  }
): WorkspaceStateManager {
  return WorkspaceStateManager.createWorkspace(options)
}

/**
 * Load a workspace from content
 * @param content The workspace content
 */
export function loadWorkspace(content: WorkspaceContentValue): WorkspaceStateManager {
  return WorkspaceStateManager.loadFromContent(content)
}