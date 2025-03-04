'use client'

import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

type WorkspaceMode = 'text' | 'graphics'

interface WorkspaceContentProps {
  activeMode: WorkspaceMode
  textContent?: ReactNode
  graphicsContent?: ReactNode
}

const WorkspaceContent: React.FC<WorkspaceContentProps> = ({
  activeMode,
  textContent,
  graphicsContent
}) => {
  return (
    <div
      className="flex-1 overflow-auto p-6"
      data-testid="workspace-content"
    >
      <div
        className={twMerge(
          "transition-opacity duration-200",
          activeMode === 'text' ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        {textContent || <p>No text content available</p>}
      </div>
      
      <div
        className={twMerge(
          "transition-opacity duration-200",
          activeMode === 'graphics' ? "block opacity-100" : "hidden opacity-0"
        )}
      >
        {graphicsContent || <p>No graphics content available</p>}
      </div>
    </div>
  )
}

export default WorkspaceContent