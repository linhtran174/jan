'use client'

import React, { ReactNode } from 'react'

interface WorkspaceGraphicsContainerProps {
  children?: ReactNode
}

const WorkspaceGraphicsContainer: React.FC<WorkspaceGraphicsContainerProps> = ({
  children
}) => {
  return (
    <div className="w-full h-full bg-white">
      <div className="w-full h-full overflow-auto p-4 flex items-center justify-center">
        {children}
      </div>
    </div>
  )
}

export default WorkspaceGraphicsContainer