import { 
  AssistantTool,
  events,
  InferenceTool, 
  MessageRequest, 
  WorkspaceEventType
} from '@janhq/core'

export class ModifyDocumentElementTool extends InferenceTool {
  name = 'modify_document_element';

  async process(
    data: MessageRequest,
    tool?: AssistantTool
  ): Promise<MessageRequest> {
    if (!data.threadId || !tool) {
      return Promise.resolve(data)
    }

    const params = {
      workspaceId: tool.settings?.workspaceId,
      content: tool.settings?.content || ''
    };

    if (!params.workspaceId) {
      console.error('No workspace ID provided');
      return Promise.resolve(data);
    }

    // Emit document element modified event
    events.emit(WorkspaceEventType.DocumentElementModified, {
      workspaceId: params.workspaceId,
      content: params.content
    });

    // Add a text confirmation to the message content
    if (data.messages && data.messages.length > 0) {
      const lastMessage = data.messages[data.messages.length - 1];
      
      // Update the message content with a confirmation text
      if (typeof lastMessage.content === 'string') {
        lastMessage.content += `\n\n[Document content in workspace "${params.workspaceId}" modified successfully]`;
      } else if (Array.isArray(lastMessage.content) && lastMessage.content.length > 0) {
        // Find the first text content item to update
        const textItem = lastMessage.content.find(item => item.type === 'text');
        if (textItem) {
          textItem.text += `\n\n[Document content in workspace "${params.workspaceId}" modified successfully]`;
        }
      }
    }
    
    // Return the modified message request
    return Promise.resolve(data);
  }
}