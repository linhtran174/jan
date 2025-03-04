'use client'

import React, { useState, useCallback, ReactNode } from 'react'
import { WorkspaceContentValue } from '@janhq/core'
import { twMerge } from 'tailwind-merge'
import WorkspaceHeader from '@/containers/WorkspaceContainer/WorkspaceHeader'
import WorkspaceContent from '@/containers/WorkspaceContainer/WorkspaceContent'

type WorkspaceMode = 'text' | 'graphics'

interface WorkspaceContainerProps {
  workspace: WorkspaceContentValue
  isOpen: boolean
  onClose: () => void
  textContent?: ReactNode
  graphicsContent?: ReactNode
}

const WorkspaceContainer: React.FC<WorkspaceContainerProps> = ({
  workspace,
  isOpen,
  onClose,
  textContent,
  graphicsContent
}) => {
  const [activeMode, setActiveMode] = useState<WorkspaceMode>('text')

  const handleModeChange = useCallback((mode: WorkspaceMode) => {
    setActiveMode(mode)
  }, [])
  
  if (!isOpen) return null
  
  return (
    <div className="absolute inset-0 z-10 w-full h-full">
      <div
        className={twMerge(
          "flex flex-col w-full h-full bg-[hsla(var(--app-bg))] shadow-xl",
          "border-[hsla(var(--app-border))] overflow-hidden",
          "transition-all duration-200 transform rounded-lg m-2",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        )}
      >
        <WorkspaceHeader 
          title={workspace.metadata?.title || "Workspace"}
          activeMode={activeMode}
          onModeChange={handleModeChange}
          onClose={onClose}
        />
        
        <WorkspaceContent 
          activeMode={activeMode}
          textContent={textContent}
          graphicsContent={graphicsContent}
        />
      </div>
    </div>
  )
}

export default WorkspaceContainer