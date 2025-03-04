import { WorkspaceContentValue } from '@janhq/core'
import { atom } from 'jotai'

interface WorkspaceState {
  isOpen: boolean
  workspace: WorkspaceContentValue | null
}

export const workspaceStateAtom = atom<WorkspaceState>({
  isOpen: false,
  workspace: null
})