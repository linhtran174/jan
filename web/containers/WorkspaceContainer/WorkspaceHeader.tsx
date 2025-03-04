'use client'

import React from 'react'
import { X } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type WorkspaceMode = 'text' | 'graphics'

interface WorkspaceHeaderProps {
  title: string
  activeMode: WorkspaceMode
  onModeChange: (mode: WorkspaceMode) => void
  onClose: () => void
}

const WorkspaceHeader: React.FC<WorkspaceHeaderProps> = ({
  title,
  activeMode,
  onModeChange,
  onClose
}) => {
  return (
    <div className="flex items-center justify-between border-b border-[hsla(var(--app-border))] p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      
      <div className="flex items-center gap-4">
        <div className="flex rounded-md border border-[hsla(var(--app-border))]">
          <button
            className={twMerge(
              "px-3 py-1 text-sm",
              activeMode === 'text' 
                ? "bg-[hsla(var(--primary-bg))] text-[hsla(var(--primary-fg))]" 
                : "hover:bg-[hsla(var(--background-modifier-hover))]"
            )}
            onClick={() => onModeChange('text')}
          >
            Text
          </button>
          <button
            className={twMerge(
              "px-3 py-1 text-sm",
              activeMode === 'graphics' 
                ? "bg-[hsla(var(--primary-bg))] text-[hsla(var(--primary-fg))]" 
                : "hover:bg-[hsla(var(--background-modifier-hover))]"
            )}
            onClick={() => onModeChange('graphics')}
          >
            Graphics
          </button>
        </div>
        
        <button
          onClick={onClose}
          className="rounded-full p-1 hover:bg-[hsla(var(--background-modifier-hover))]"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}

export default WorkspaceHeader