import { CreateWorkspaceTool } from './createWorkspace';
import { ModifyDocumentElementTool } from './modifyDocumentElement';
import { ModifyGraphicsElementTool } from './modifyGraphicsElement';

export class WorkspaceTools {
  createWorkspace = new CreateWorkspaceTool();
  modifyDocumentElement = new ModifyDocumentElementTool();
  modifyGraphicsElement = new ModifyGraphicsElementTool();
  
  getAll() {
    return [
      this.createWorkspace,
      this.modifyDocumentElement,
      this.modifyGraphicsElement
    ];
  }
}