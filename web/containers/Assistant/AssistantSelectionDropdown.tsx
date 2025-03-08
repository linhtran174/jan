import { FC, useRef, useEffect } from 'react'
import { Assistant } from '@janhq/core'
import { Button } from '@janhq/joi'
import { useAtom } from 'jotai'
import { mainViewStateAtom } from '@/helpers/atoms/App.atom'
import { MainViewState } from '@/constants/screens'
import { useSetAtom } from 'jotai'
import { selectedSettingAtom } from '@/helpers/atoms/Setting.atom'

interface AssistantSelectionDropdownProps {
  assistants: Assistant[]
  onSelect: (assistant: Assistant) => void
  onClose: () => void
}

const AssistantSelectionDropdown: FC<AssistantSelectionDropdownProps> = ({
  assistants,
  onSelect,
  onClose,
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [, setMainViewState] = useAtom(mainViewStateAtom)
  const setSelectedSetting = useSetAtom(selectedSettingAtom)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [onClose])

  const handleManageAssistantsClick = () => {
    setMainViewState(MainViewState.Settings)
    setSelectedSetting('Assistants')
    onClose()
  }

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 mt-2 w-72 rounded-md border border-[hsla(var(--app-border))] shadow-lg"
      style={{
        zIndex: 100,
        transform: 'none',
        backgroundColor: 'hsla(var(--app-bg))',
        overflow: 'hidden'
      }}
    >
      <div 
        className="p-2 font-medium border-b border-[hsla(var(--app-border))]"
        style={{ backgroundColor: 'hsla(var(--app-bg))' }}
      >
        New Thread
      </div>
      <div 
        className="max-h-80 overflow-y-auto py-2"
        style={{ backgroundColor: 'hsla(var(--app-bg))' }}
      >
        {assistants.map((assistant) => (
          <div
            key={assistant.id}
            className="px-4 py-2 hover:bg-[hsla(var(--dropdown-hover))] cursor-pointer"
            onClick={() => onSelect(assistant)}
          >
            <div className="flex items-center gap-3">
              {assistant.avatar && (
                <div className="h-8 w-8 rounded-full overflow-hidden flex-shrink-0">
                  <img
                    src={assistant.avatar}
                    alt={assistant.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="font-medium">{assistant.name}</div>
                {assistant.description && (
                  <div className="text-xs text-[hsla(var(--text-secondary))] line-clamp-2">
                    {assistant.description}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div 
        className="border-t border-[hsla(var(--app-border))] p-2"
        style={{ backgroundColor: 'hsla(var(--app-bg))' }}
      >
        <Button variant="outline" size="small" onClick={handleManageAssistantsClick} className="w-full">
          + Manage Assistants
        </Button>
      </div>
    </div>
  )
}

export default AssistantSelectionDropdown