import { FC } from 'react'
import { Assistant } from '@janhq/core'
import { Button } from '@janhq/joi'
import { Edit2, Trash2 } from 'lucide-react'

interface AssistantCardProps {
  assistant: Assistant
  onEdit: () => void
  onDelete: () => void
}

const AssistantCard: FC<AssistantCardProps> = ({ 
  assistant, 
  onEdit, 
  onDelete 
}) => {
  // TODO: Add usage count when backend API is available
  const usageCount = 0

  return (
    <div className="border border-[hsla(var(--app-border))] rounded-md p-4">
      <div className="flex items-start justify-between">
        <div className="flex gap-3">
          {assistant.avatar && (
            <div className="h-10 w-10 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={assistant.avatar} 
                alt={assistant.name} 
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-base">{assistant.name}</h3>
              {assistant.id === 'default' && (
                <span className="text-xs bg-[hsla(var(--tag-bg))] text-[hsla(var(--tag-text))] px-2 py-1 rounded-full">
                  Default
                </span>
              )}
            </div>
            {assistant.description && (
              <p className="text-sm text-[hsla(var(--text-secondary))]">
                {assistant.description}
              </p>
            )}
            <div className="mt-2 flex items-center gap-4 text-xs text-[hsla(var(--text-secondary))]">
              <div>
                <strong>Model:</strong> {assistant.model || 'Any'}
              </div>
              <div>
                <strong>Used in:</strong> {usageCount} threads
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="small" 
            onClick={onEdit}
            className="p-1"
          >
            <Edit2 size={16} />
          </Button>
          <Button 
            variant="outline" 
            size="small" 
            onClick={onDelete}
            className="p-1"
            disabled={assistant.id === 'default'} // Prevent deleting default assistant
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default AssistantCard