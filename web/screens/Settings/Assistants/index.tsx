import { useState } from 'react'
import { useAtom } from 'jotai'
import { Button } from '@janhq/joi'
import { Assistant, AssistantExtension, ExtensionTypeEnum } from '@janhq/core'
import { PlusIcon } from 'lucide-react'
import { assistantsAtom } from '@/helpers/atoms/Assistant.atom'
import AssistantCard from './AssistantCard'
import CreateAssistantModal from './CreateAssistantModal'
import EditAssistantModal from './EditAssistantModal'
import { extensionManager } from '@/extension'

const AssistantsSettings = () => {
  const [assistants, setAssistants] = useAtom(assistantsAtom)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingAssistant, setEditingAssistant] = useState<Assistant | null>(null)

  const handleDeleteAssistant = (assistant: Assistant) => {
    // TODO: Add confirmation dialog
    setAssistants((prev) => prev.filter((a) => a.id !== assistant.id))
    // TODO: Add API call to delete assistant
    extensionManager.get<AssistantExtension>(ExtensionTypeEnum.Assistant)
    ?.deleteAssistant(assistant)
    .catch(() => {})
  }

  const handleCreateAssistant = (assistant: Assistant) => {
    setAssistants((prev) => [...prev, assistant])
    // TODO: Add API call to create assistant

    extensionManager.get<AssistantExtension>(ExtensionTypeEnum.Assistant)
    ?.createAssistant(assistant)
    .catch(() => {})
    
    setShowCreateModal(false)
  }

  const handleUpdateAssistant = (assistant: Assistant) => {
    setAssistants((prev) => 
      prev.map((a) => (a.id === assistant.id ? assistant : a))
    )
    // TODO: Add API call to update assistant
    setEditingAssistant(null)
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Assistants</h2>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2"
        >
          <PlusIcon size={16} />
          Create Assistant
        </Button>
      </div>

      <div className="space-y-4">
        {assistants.map((assistant) => (
          <AssistantCard
            key={assistant.id}
            assistant={assistant}
            onEdit={() => setEditingAssistant(assistant)}
            onDelete={() => handleDeleteAssistant(assistant)}
          />
        ))}
        {assistants.length === 0 && (
          <div className="text-center py-12 text-[hsla(var(--text-secondary))]">
            No assistants found. Create your first assistant with the button above.
          </div>
        )}
      </div>

      {showCreateModal && (
        <CreateAssistantModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateAssistant}
        />
      )}

      {editingAssistant && (
        <EditAssistantModal
          assistant={editingAssistant}
          onClose={() => setEditingAssistant(null)}
          onSave={handleUpdateAssistant}
        />
      )}
    </div>
  )
}

export default AssistantsSettings