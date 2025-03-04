'use client'

import React from 'react'
import { Layout, LayoutGrid } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

type WorkspaceMode = 'text' | 'graphics'

interface WorkspaceToolbarProps {
  activeMode: WorkspaceMode
  onModeChange: (mode: WorkspaceMode) => void
}

const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  activeMode,
  onModeChange
}) => {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-[hsla(var(--background-modifier))] p-1">
      <button
        className={twMerge(
          'rounded-md p-1 transition-colors hover:bg-[hsla(var(--app-bg))]',
          activeMode === 'text' && 'bg-[hsla(var(--app-bg))]'
        )}
        onClick={() => onModeChange('text')}
        title="Text Mode"
      >
        <Layout className="h-4 w-4" />
      </button>
      <button
        className={twMerge(
          'rounded-md p-1 transition-colors hover:bg-[hsla(var(--app-bg))]',
          activeMode === 'graphics' && 'bg-[hsla(var(--app-bg))]'
        )}
        onClick={() => onModeChange('graphics')}
        title="Graphics Mode"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  )
}

export default WorkspaceToolbar