'use client'

import React from 'react'
import { AssistantExtension, CanvasElement, DocumentElement, ExtensionTypeEnum, WorkspaceContentValue, WorkspaceElement } from '@janhq/core'
import { LayoutDashboard } from 'lucide-react'
import { useAtom, useSetAtom } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { workspaceStateAtom } from '@/helpers/atoms/Workspace.atom'
import { extensionManager } from '@/extension/ExtensionManager'

interface WorkspaceMessageProps {
  text: string
}

const parseWorkspaceText = (text: string, workspace: WorkspaceContentValue | null ): WorkspaceContentValue | null => {
  if(!text) return null;
  const titleMatch = text.match(/<title>([\s\S]*?)<\/title>/);
  const createWorkspaceMatch = text.match(/<create_workspace>([\s\S]*?)<\/create_workspace>/);

  const docMatch = 
  text.match(/<workspace_document_content>([\s\S]*?)<\/workspace_document_content>/) ||
  text.match(/<modify_document_content>([\s\S]*?)<\/modify_document_content>/)
  const newContentMatch = text.match(/<newContent>([\s\S]*?)<\/newContent>/)
  const graphicMatch = 
  text.match(/<workspace_graphic_content>([\s\S]*?)<\/workspace_graphic_content>/) ||
  text.match(/<modify_graphic_content>([\s\S]*?)<\/modify_graphic_content>/)

  const elements: WorkspaceElement[] = [];
  if (createWorkspaceMatch && workspace == null){  
    if (docMatch) {
      elements.push({
        id: 'root-document',
        type: 'doc',
        content: { text: docMatch[1].trim() }
      } as DocumentElement);
    }

    if (graphicMatch?.[1]) {
      elements.push({
        id: 'root-canvas',
        type: 'graphic',
        content: graphicMatch[1].trim(),
        properties: {}
      } as CanvasElement);
    }

    return {
      workspaceId: "TODO: implement workspaces with id",
      version: 1,
      elements,
      activeMode: graphicMatch ? "canvas" : "document",
      dimensions: {
        width: 0,
        height: 0
      },
      metadata:{
        title: titleMatch ? titleMatch[1].trim() : "Untitled Workspace",
        description: "TODO: add workspace description",
      }
    }
  }
  else if(workspace && docMatch && newContentMatch){
    let e = workspace.elements.find<DocumentElement>((w)=>{ return w.type =="doc"});
    if(e && e.content && e?.content.text) e.content.text = newContentMatch[1].trim()
  }
  else if(workspace && graphicMatch && newContentMatch){
    let e = workspace.elements.find<CanvasElement>((w)=>{ return w.type =="graphic"});
    if(e && e.content) e.content = newContentMatch[1].trim()
  }

  return workspace;
}

const WorkspaceMessage: React.FC<WorkspaceMessageProps> = ({ text }) => {
  const [ workspaceState, setWorkspaceState ] = useAtom(workspaceStateAtom)
  
  const workspace = parseWorkspaceText(text, workspaceState.workspace)

  const handleOpenWorkspace = () => {
    setWorkspaceState({
      isOpen: true,
      workspace: workspace
    })
  }
  
  return (
    <>
      <div className="mb-4">
        <button
          onClick={handleOpenWorkspace}
          className={twMerge(
            "flex items-center gap-2 px-3 py-2 rounded-md",
            "bg-[hsla(var(--primary-bg))] text-[hsla(var(--primary-fg))]",
            "hover:bg-[hsla(var(--primary-bg-hover))] transition-colors duration-200"
          )}
          data-testid="workspace-button"
        >
          <LayoutDashboard size={16} />
          <span>{workspace?.metadata?.title || "Open Workspace"}</span>
        </button>
      </div>
    </>
  )
}

export default WorkspaceMessage