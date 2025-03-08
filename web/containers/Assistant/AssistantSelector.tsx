import { FC, useRef, useState, useEffect } from 'react'
import { Assistant, ThreadAssistantInfo } from '@janhq/core'
import { Button } from '@janhq/joi'
import { ChevronDown } from 'lucide-react'
import { useAtom } from 'jotai'
import { mainViewStateAtom } from '@/helpers/atoms/App.atom'
import { MainViewState } from '@/constants/screens'
import { useSetAtom } from 'jotai'
import { selectedSettingAtom } from '@/helpers/atoms/Setting.atom'

interface AssistantSelectorProps {
  assistants: Assistant[]
  activeAssistant: ThreadAssistantInfo
  onAssistantChange: (assistant: Assistant) => void
}

const AssistantSelector: FC<AssistantSelectorProps> = ({
  assistants,
  activeAssistant,
  onAssistantChange,
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [, setMainViewState] = useAtom(mainViewStateAtom)
  const setSelectedSetting = useSetAtom(selectedSettingAtom)

  // Find the full assistant object that matches the current active assistant
  const currentAssistant = assistants.find(
    (assistant) => assistant.id === activeAssistant?.assistant_id
  )

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleManageAssistantsClick = () => {
    setMainViewState(MainViewState.Settings)
    setSelectedSetting('Assistants')
    setIsOpen(false)
  }

  if (!currentAssistant) return null

  return (
    <div className="relative" ref={dropdownRef}>
      <div className="mb-2 font-bold">Current Assistant</div>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between"
      >
        <div className="flex items-center gap-2">
          {currentAssistant.avatar && (
            <div className="h-6 w-6 rounded-full overflow-hidden">
              <img
                src={currentAssistant.avatar}
                alt={currentAssistant.name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <span>{currentAssistant.name}</span>
        </div>
        <ChevronDown size={16} />
      </Button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-[hsla(var(--app-border))] bg-[hsla(var(--dropdown-bg))] shadow-lg">
          <div className="max-h-64 overflow-y-auto">
            {assistants.map((assistant) => (
              <div
                key={assistant.id}
                className={`px-4 py-2 hover:bg-[hsla(var(--dropdown-hover))] cursor-pointer ${
                  assistant.id === activeAssistant.assistant_id
                    ? 'bg-[hsla(var(--dropdown-active))]'
                    : ''
                }`}
                onClick={() => {
                  onAssistantChange(assistant)
                  setIsOpen(false)
                }}
              >
                <div className="flex items-center gap-2">
                  {assistant.avatar && (
                    <div className="h-6 w-6 rounded-full overflow-hidden flex-shrink-0">
                      <img
                        src={assistant.avatar}
                        alt={assistant.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <span>{assistant.name}</span>
                </div>
              </div>
            ))}
          </div>
          <div
            className="border-t border-[hsla(var(--app-border))] p-2 text-sm cursor-pointer text-center hover:bg-[hsla(var(--dropdown-hover))]"
            onClick={handleManageAssistantsClick}
          >
            Manage Assistants
          </div>
        </div>
      )}
    </div>
  )
}

export default AssistantSelector