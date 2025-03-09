import { FC, useState, useEffect } from 'react'
import { Assistant, AssistantExtension } from '@janhq/core'
import { Button, TextArea } from '@janhq/joi'
import { X } from 'lucide-react'
import { extensionManager } from '@/extension'

interface EditAssistantModalProps {
  assistant: Assistant
  onClose: () => void
  onSave: (assistant: Assistant) => void
}

const EditAssistantModal: FC<EditAssistantModalProps> = ({ 
  assistant,
  onClose, 
  onSave
}) => {
  const [name, setName] = useState(assistant.name)
  const [description, setDescription] = useState(assistant.description || '')
  const [instructions, setInstructions] = useState(assistant.instructions || '')
  const [model, setModel] = useState(assistant.model || '*')

  // Update form when the assistant prop changes
  useEffect(() => {
    setName(assistant.name)
    setDescription(assistant.description || '')
    setInstructions(assistant.instructions || '')
    setModel(assistant.model || '*')
  }, [assistant])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Create updated assistant object
    const updatedAssistant: Assistant = {
      ...assistant,
      name,
      description,
      model,
      instructions,
    }
    
    onSave(updatedAssistant)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-[hsla(var(--app-bg))] rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium">Edit Assistant</h2>
          <Button
            variant="outline"
            size="small"
            onClick={onClose}
            className="p-1"
          >
            <X size={18} />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Assistant Name"
              required
              className="w-full px-3 py-2 border border-[hsla(var(--app-border))] rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
              placeholder="Briefly describe this assistant's purpose"
              className="w-full px-3 py-2 border border-[hsla(var(--app-border))] rounded-md"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Instructions
            </label>
            <TextArea
              value={instructions}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInstructions(e.target.value)}
              placeholder="You are a helpful assistant..."
              required
              autoResize
              rows={4}
            />
          </div>

          {/* TODO: Add model dropdown selection */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Model Preference
            </label>
            <input
              type="text"
              value={model}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setModel(e.target.value)}
              placeholder="Model ID or * for any model"
              className="w-full px-3 py-2 border border-[hsla(var(--app-border))] rounded-md"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name || !instructions}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAssistantModal