import {
  fs,
  Assistant,
  events,
  joinPath,
  AssistantExtension,
  AssistantEvent,
  ToolManager,
  MessageEvent,
  MessageRequest,
  WorkspaceEventType,
  WorkspaceToolRequest,
  WorkspaceToolResponse,
  AssistantTool
} from '@janhq/core'
import { RetrievalTool } from './tools/retrieval'
import { WorkspaceTools } from './tools/workspace'

export default class JanAssistantExtension extends AssistantExtension {
  private static readonly _homeDir = 'file://assistants'
  private static readonly _workspaceDir = 'file://workspace'
  private tools: WorkspaceTools;
  
  constructor(
    url?: string,
    name?: string,
    productName?: string,
    active?: boolean,
    description?: string,
    version?: string
  ) {
    super(url, name, productName, active, description, version);
    this.tools = new WorkspaceTools();
  }

  async onLoad() {
    // Register the retrieval tool
    ToolManager.instance().register(new RetrievalTool())

    // Register all workspace tools
    this.tools.getAll().forEach(tool => {
      ToolManager.instance().register(tool);
    });
    
    // Register message handlers for XML parsing
    events.on(MessageEvent.OnMessageSent, (data: MessageRequest) =>
      this.handleMessage(data)
    );

    // making the assistant directory
    const assistantDirExist = await fs.existsSync(
      JanAssistantExtension._homeDir
    )
    if (
      localStorage.getItem(`${this.name}-version`) !== VERSION ||
      !assistantDirExist
    ) {
      if (!assistantDirExist) await fs.mkdir(JanAssistantExtension._homeDir)

      // Write assistant metadata
      await this.createJanAssistant()
      // Finished migration
      localStorage.setItem(`${this.name}-version`, VERSION)
      // Update the assistant list
      events.emit(AssistantEvent.OnAssistantsUpdate, {})
    }
    
    // Create workspace directory if it doesn't exist
    const workspaceDirExists = await fs.existsSync(JanAssistantExtension._workspaceDir);
    if (!workspaceDirExists) {
      await fs.mkdir(JanAssistantExtension._workspaceDir);
    }
  }

  /**
   * Called when the extension is unloaded.
   */
  onUnload(): void {
    // Cleanup event handlers
    try {
      events.off(MessageEvent.OnMessageSent, (data: MessageRequest) => this.handleMessage(data));
    } catch (error) {
      console.error("Error unregistering message handler:", error);
    }
  }
  
  private async handleMessage(data: MessageRequest): Promise<void> {
    if (!data.messages || !data.threadId) return;
    
    // Get the last message content
    const lastMessage = data.messages[data.messages.length - 1];
    if (!lastMessage || !lastMessage.content) return;
    
    // Convert content to string if it's not already
    const messageContent = typeof lastMessage.content === 'string'
      ? lastMessage.content
      : JSON.stringify(lastMessage.content);
    
    // Process messages and parse XML-formatted tool commands
    const xmlCommand = this.parseXmlToolCommand(messageContent, data.threadId);
    if (xmlCommand) {
      await this.executeToolCommand(xmlCommand);
    }
  }
  
  private parseXmlToolCommand(content: string, threadId: string): WorkspaceToolRequest | null {
    // Parse XML-formatted tool commands
    const createWorkspaceMatch = content.match(/<create_workspace>([\s\S]*?)<\/create_workspace>/);
    const modifyDocumentMatch = content.match(/<modify_document_element>([\s\S]*?)<\/modify_document_element>/);
    const modifyGraphicsMatch = content.match(/<modify_graphics_element>([\s\S]*?)<\/modify_graphics_element>/);
    
    let toolRequest: WorkspaceToolRequest | null = null;
    
    if (createWorkspaceMatch) {
      const innerContent = createWorkspaceMatch[1];
      const nameMatch = innerContent.match(/<workspace_name>([\s\S]*?)<\/workspace_name>/);
      const docContentMatch = innerContent.match(/<workspace_document_content>([\s\S]*?)<\/workspace_document_content>/);
      
      if (nameMatch && docContentMatch) {
        toolRequest = {
          toolName: 'create_workspace',
          parameters: {
            workspaceName: nameMatch[1].trim(),
            documentContent: docContentMatch[1].trim()
          },
          threadId
        };
        
        // Optional graphics content
        const graphicsMatch = innerContent.match(/<workspace_graphics_content>([\s\S]*?)<\/workspace_graphics_content>/);
        if (graphicsMatch) {
          try {
            const graphicsContent = JSON.parse(graphicsMatch[1].trim());
            toolRequest.parameters.graphicsContent = graphicsContent;
          } catch (e) {
            console.error('Invalid graphics content JSON', e);
          }
        }
      }
    } else if (modifyDocumentMatch) {
      const innerContent = modifyDocumentMatch[1];
      const workspaceIdMatch = innerContent.match(/<workspace_id>([\s\S]*?)<\/workspace_id>/);
      const contentMatch = innerContent.match(/<content>([\s\S]*?)<\/content>/);
      
      if (workspaceIdMatch && contentMatch) {
        toolRequest = {
          toolName: 'modify_document_element',
          parameters: {
            workspaceId: workspaceIdMatch[1].trim(),
            content: contentMatch[1].trim()
          },
          threadId
        };
      }
    } else if (modifyGraphicsMatch) {
      const innerContent = modifyGraphicsMatch[1];
      const workspaceIdMatch = innerContent.match(/<workspace_id>([\s\S]*?)<\/workspace_id>/);
      const propertiesMatch = innerContent.match(/<properties>([\s\S]*?)<\/properties>/);
      
      if (workspaceIdMatch && propertiesMatch) {
        try {
          const properties = JSON.parse(propertiesMatch[1].trim());
          toolRequest = {
            toolName: 'modify_graphics_element',
            parameters: {
              workspaceId: workspaceIdMatch[1].trim(),
              properties
            },
            threadId
          };
        } catch (e) {
          console.error('Invalid properties JSON', e);
        }
      }
    }
    
    return toolRequest;
  }
  
  private async executeToolCommand(toolRequest: WorkspaceToolRequest): Promise<void> {
    try {
      // Create an assistant tool object to pass to the InferenceTool
      const assistantTool: AssistantTool = {
        type: toolRequest.toolName,
        enabled: true,
        settings: toolRequest.parameters
      };
      
      // Create a basic message request with threadId
      const messageRequest: MessageRequest = {
        threadId: toolRequest.threadId,
        attachments: null
      };
      
      // Execute the appropriate tool based on the request
      switch (toolRequest.toolName) {
        case 'create_workspace':
          await this.tools.createWorkspace.process(messageRequest, assistantTool);
          break;
          
        case 'modify_document_element':
          await this.tools.modifyDocumentElement.process(messageRequest, assistantTool);
          break;
          
        case 'modify_graphics_element':
          await this.tools.modifyGraphicsElement.process(messageRequest, assistantTool);
          break;
          
        default:
          console.warn(`Unknown tool: ${toolRequest.toolName}`);
          return;
      }
      
      // Send result message
      await this.sendToolResultMessage({
        success: true
      }, toolRequest);
      
    } catch (error) {
      console.error('Error executing workspace tool:', error);
      await this.sendToolResultMessage({
        success: false,
        error: error instanceof Error ? error.message : String(error)
      }, toolRequest);
    }
  }
  
  private async sendToolResultMessage(response: WorkspaceToolResponse, request: WorkspaceToolRequest): Promise<void> {
    // Create a message from the system about the tool use result
    const resultMessage = `[results for ${request.toolName}: ${response.success ? 'success' : 'failure'}${response.error ? ` - ${response.error}` : ''}]`;
    
    // Create a message to inform about the tool use result
    events.emit(MessageEvent.OnMessageResponse, {
      threadId: request.threadId,
      content: resultMessage
    });
  }

  async createAssistant(assistant: Assistant): Promise<void> {
    const assistantDir = await joinPath([
      JanAssistantExtension._homeDir,
      assistant.id,
    ])
    if (!(await fs.existsSync(assistantDir))) await fs.mkdir(assistantDir)

    // store the assistant metadata json
    const assistantMetadataPath = await joinPath([
      assistantDir,
      'assistant.json',
    ])
    try {
      await fs.writeFileSync(
        assistantMetadataPath,
        JSON.stringify(assistant, null, 2)
      )
    } catch (err) {
      console.error(err)
    }
  }

  private _defaultWorkspaceAssistant: Assistant = {
    instructions: `You are a helpful assistant with a set of workspace tools.
In order to use tools, use the following format:
<toolName>
<parameter1_name>parameter1_value</parameter1_name>
<parameter2_name>parameter2_value</parameter2_name>
</toolName>
The list of tools is in the TOOLS section below.

You are equipped with the ability to create a workspace that allows collaborating back-and-forth with the user. Think and evaluate if the user enquiry needs the use of a workspace (always think in <think> tag). If it is, go ahead and create one. If you are unsure, explore the user needs before deciding. 

Popular use case of workspace are:
- Collaborating on a piece of existing document
- Planning something
- Drafting out new ideas 
- Writing and testing out a piece of code

Workspace consists of 2 part: document part and graphic part.
Although called that way, due to the technical limitation, the content of both parts are just text. Document part is in markdown format, and graphic part is in HTML which is rendered in an environment with Three.JS support

========== TOOLS ==========
1. Create workspace tool 
- toolName: create_workspace
- parameters: 
-- workspace_name
-- workspace_document_content
-- workspace_graphics_content

2. Modify workspace document 
- toolName: modify_document_content
- parameters:
-- content

3. Modify workspace graphics
- toolName: modify_graphic_content
- parameters:
-- content

    `,
    description: "Experimental assistant with workspace tools",
    avatar: '',
    thread_location: '',
    id: 'workspace-experimental',
    object: '',
    created_at: 0,
    name: 'Joel',
    model: 'claude-3.7-sonnet',
    file_ids: [],
    tools: [{
      type: 'create_workspace',
      enabled: true,
      settings: {}
    },
    {
      type: 'modify_document_element',
      enabled: true,
      settings: {}
    },
    {
      type: 'modify_graphics_element',
      enabled: true,
      settings: {}
    }]
  }

  async getAssistants(): Promise<Assistant[]> {
    try {
      // get all the assistant directories
      // get all the assistant metadata json
      const results: Assistant[] = [this._defaultWorkspaceAssistant]

      const allFileName: string[] = await fs.readdirSync(
        JanAssistantExtension._homeDir
      )

      for (const fileName of allFileName) {
        const filePath = await joinPath([
          JanAssistantExtension._homeDir,
          fileName,
        ])

        if (!(await fs.fileStat(filePath))?.isDirectory) continue
        const jsonFiles: string[] = (await fs.readdirSync(filePath)).filter(
          (file: string) => file === 'assistant.json'
        )

        if (jsonFiles.length !== 1) {
          // has more than one assistant file -> ignore
          continue
        }

        const content = await fs.readFileSync(
          await joinPath([filePath, jsonFiles[0]]),
          'utf-8'
        )
        const assistant: Assistant =
          typeof content === 'object' ? content : JSON.parse(content)

        results.push(assistant)
      }

      return results
    } catch (err) {
      console.debug(err)
      return [this.defaultAssistant]
    }
  }

  async deleteAssistant(assistant: Assistant): Promise<void> {
    if (assistant.id === 'jan') {
      return Promise.reject('Cannot delete Jan Assistant')
    }

    // remove the directory
    const assistantDir = await joinPath([
      JanAssistantExtension._homeDir,
      assistant.id,
    ])
    return fs.rm(assistantDir)
  }

  private async createJanAssistant(): Promise<void> {
    await this.createAssistant(this.defaultAssistant)
  }

  private defaultAssistant: Assistant = {
    avatar: '',
    thread_location: undefined,
    id: 'jan',
    object: 'assistant',
    created_at: Date.now() / 1000,
    name: 'Jan',
    description: 'A default assistant that can use all downloaded models and workspace features',
    model: '*',
    instructions: '',
    tools: [
      {
        type: 'retrieval',
        enabled: false,
        useTimeWeightedRetriever: false,
        settings: {
          top_k: 2,
          chunk_size: 1024,
          chunk_overlap: 64,
          retrieval_template: `Use the following pieces of context to answer the question at the end.
----------------
CONTEXT: {CONTEXT}
----------------
QUESTION: {QUESTION}
----------------
Helpful Answer:`,
        },
      }
    ],
    file_ids: [],
    metadata: undefined,
  }
}
