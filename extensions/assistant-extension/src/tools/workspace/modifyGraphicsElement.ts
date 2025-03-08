import { 
  AssistantTool,
  events,
  InferenceTool, 
  MessageRequest,
  WorkspaceEventType
} from '@janhq/core'

export class ModifyGraphicsElementTool extends InferenceTool {
  name = 'modify_graphics_element';

  async process(
    data: MessageRequest,
    tool?: AssistantTool
  ): Promise<MessageRequest> {
    if (!data.threadId || !tool) {
      return Promise.resolve(data)
    }

    const params = {
      workspaceId: tool.settings?.workspaceId,
      properties: tool.settings?.properties || {}
    };

    if (!params.workspaceId) {
      console.error('No workspace ID provided');
      return Promise.resolve(data);
    }

    // Validate properties
    const properties = params.properties;
    if (!properties || typeof properties !== 'object') {
      console.error('Invalid graphics properties provided');
      return Promise.resolve(data);
    }

    // Emit graphics element modified event
    events.emit(WorkspaceEventType.GraphicsElementModified, {
      workspaceId: params.workspaceId,
      properties: properties
    });

    // Add a text confirmation to the message content
    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      
      // Update the message content with a confirmation text
      if (typeof lastMessage.content === 'string') {
        lastMessage.content += `\n\n[Graphics element in workspace "${params.workspaceId}" modified successfully]`;
      } else if (Array.isArray(lastMessage.content) && lastMessage.content.length > 0) {
        // Find the first text content item to update
        const textItem = lastMessage.content.find(item => item.type === 'text');
        if (textItem) {
          textItem.text += `\n\n[Graphics element in workspace "${params.workspaceId}" modified successfully]`;
        }
      }
    }
    
    // Return the modified message request
    return Promise.resolve(data);
  }
}