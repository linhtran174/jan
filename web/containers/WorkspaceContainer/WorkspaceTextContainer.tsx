'use client'

import React, { ReactNode } from 'react'
import { ScrollArea } from '@janhq/joi'

interface WorkspaceTextContainerProps {
  children?: ReactNode
}

const WorkspaceTextContainer: React.FC<WorkspaceTextContainerProps> = ({
  children
}) => {
  return (
    <div className="flex flex-col w-full h-full">
      <ScrollArea 
        className="flex-1" 
        type="always"
      >
        <div className="px-6 py-5">
          {children}
        </div>
      </ScrollArea>
    </div>
  )
}

export default WorkspaceTextContainer