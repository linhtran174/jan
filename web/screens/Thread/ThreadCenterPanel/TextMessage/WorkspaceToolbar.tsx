import React, { memo } from 'react'
import { Layout, LayoutGrid, Monitor } from 'lucide-react'
import { twMerge } from 'tailwind-merge'

import { WorkspaceContentValue } from '@janhq/core'

type Props = {
  workspace: WorkspaceContentValue
  onModeChange: (mode: 'canvas' | 'document' | 'split') => void
}

const WorkspaceToolbar: React.FC<Props> = ({ workspace, onModeChange }) => {
  return (
    <div className="absolute right-2 top-2 flex items-center gap-2 rounded-lg bg-[hsla(var(--background-modifier))] p-1">
      <button
        className={twMerge(
          'rounded-md p-1 transition-colors hover:bg-[hsla(var(--app-bg))]',
          workspace.activeMode === 'canvas' && 'bg-[hsla(var(--app-bg))]'
        )}
        onClick={() => onModeChange('canvas')}
        title="Canvas Mode"
      >
        <Monitor className="h-4 w-4" />
      </button>
      <button
        className={twMerge(
          'rounded-md p-1 transition-colors hover:bg-[hsla(var(--app-bg))]',
          workspace.activeMode === 'document' && 'bg-[hsla(var(--app-bg))]'
        )}
        onClick={() => onModeChange('document')}
        title="Document Mode"
      >
        <Layout className="h-4 w-4" />
      </button>
      <button
        className={twMerge(
          'rounded-md p-1 transition-colors hover:bg-[hsla(var(--app-bg))]',
          workspace.activeMode === 'split' && 'bg-[hsla(var(--app-bg))]'
        )}
        onClick={() => onModeChange('split')}
        title="Split Mode"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
    </div>
  )
}

export default memo(WorkspaceToolbar)