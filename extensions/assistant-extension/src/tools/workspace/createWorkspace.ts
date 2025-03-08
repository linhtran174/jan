import {
  AssistantTool,
  events,
  InferenceTool,
  MessageRequest,
  WorkspaceContentValue,
  WorkspaceEventType
} from '@janhq/core'

export class CreateWorkspaceTool extends InferenceTool {
  name = 'create_workspace';

  async process(
    data: MessageRequest,
    tool?: AssistantTool
  ): Promise<MessageRequest> {
    if (!data.threadId || !tool) {
      return Promise.resolve(data)
    }

    const params = {
      workspaceName: tool.settings?.workspaceName || 'Untitled Workspace',
      documentContent: tool.settings?.documentContent || '',
      graphicsContent: tool.settings?.graphicsContent
    };

    // Create a new workspace with the specified elements
    const newWorkspace: WorkspaceContentValue = {
      workspaceId: `workspace-${Date.now()}`,
      version: 1,
      elements: [
        {
          id: `doc-element-${Date.now()}`,
          type: 'paragraph',
          content: {
            text: params.documentContent
          }
        }
      ],
      activeMode: 'document',
      dimensions: {
        width: 800,
        height: 600
      },
      metadata: {
        title: params.workspaceName,
        created: Date.now(),
        modified: Date.now()
      }
    };
    
    // Add graphics element if provided
    if (params.graphicsContent) {
      newWorkspace.elements.push({
        id: `canvas-element-${Date.now()}`,
        type: 'webgl',
        properties: {
          width: params.graphicsContent.width || 400,
          height: params.graphicsContent.height || 300
        }
      });
    }
    
    // Emit workspace created event
    events.emit(WorkspaceEventType.WorkspaceCreated, { workspace: newWorkspace });
    
    // Add a text confirmation to the message content instead of trying to add workspace content
    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      
      // Update the message content with a confirmation text
      if (typeof lastMessage.content === 'string') {
        lastMessage.content += `\n\n[Workspace "${params.workspaceName}" created successfully]`;
      } else if (Array.isArray(lastMessage.content) && lastMessage.content.length > 0) {
        // Find the first text content item to update
        const textItem = lastMessage.content.find(item => item.type === 'text');
        if (textItem) {
          textItem.text += `\n\n[Workspace "${params.workspaceName}" created successfully]`;
        }
      }
    }
    
    // Return the modified message request
    return Promise.resolve(data);
  }
}