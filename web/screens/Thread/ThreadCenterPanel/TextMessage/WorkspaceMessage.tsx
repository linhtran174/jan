'use client'

import React from 'react'
import { WorkspaceContentValue } from '@janhq/core'
import { LayoutDashboard } from 'lucide-react'
import { useSetAtom } from 'jotai'
import { twMerge } from 'tailwind-merge'
import { workspaceStateAtom } from '@/helpers/atoms/Workspace.atom'

interface WorkspaceMessageProps {
  workspace: WorkspaceContentValue
}

const WorkspaceMessage: React.FC<WorkspaceMessageProps> = ({ workspace }) => {
  const setWorkspaceState = useSetAtom(workspaceStateAtom)
  
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
          <span>{workspace.metadata?.title || "Open Workspace"}</span>
        </button>
      </div>
    </>
  )
}

export default WorkspaceMessage