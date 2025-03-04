'use client'

import React, { useEffect } from 'react'
import { useAtom, useSetAtom } from 'jotai'

import { 
  mockWorkspaceThread, 
  mockWorkspaceThreadState, 
  mockWorkspaceMessages 
} from '@/mock/mockWorkspaceThread'
 
import {
  threadsAtom,
  threadStatesAtom,
  activeThreadAtom,
  setActiveThreadIdAtom
} from '@/helpers/atoms/Thread.atom'
import { chatMessages } from '@/helpers/atoms/ChatMessage.atom'
import { addNewMessageAtom } from '@/helpers/atoms/ChatMessage.atom'

/**
 * WorkspaceDemoInitializer component
 * 
 * This component initializes the mock workspace thread when mounted.
 * It adds the thread to the threads atom and sets up the messages.
 * 
 * Usage: Simply include this component anywhere in your app to enable the demo
 * <WorkspaceDemoInitializer />
 */
const WorkspaceDemoInitializer: React.FC = () => {
  const [threads, setThreads] = useAtom(threadsAtom)
  const [threadStates, setThreadStates] = useAtom(threadStatesAtom)
  const [activeThread] = useAtom(activeThreadAtom)
  const setActiveThreadId = useSetAtom(setActiveThreadIdAtom)
  const [allMessages, setAllMessages] = useAtom(chatMessages)
  const addNewMessage = useSetAtom(addNewMessageAtom)

  useEffect(() => {
    // Check if the demo thread already exists
    const exists = threads.some(thread => thread.id === mockWorkspaceThread.id)
    
    if (!exists) {
      // Add the mock thread to the threads list
      setThreads([mockWorkspaceThread, ...threads])
      
      // Set the thread state
      setThreadStates({
        ...threadStates,
        [mockWorkspaceThread.id]: mockWorkspaceThreadState
      })
      
      // Set messages for this thread
      const updatedMessages = {
        ...(allMessages || {}),
        [mockWorkspaceThread.id]: mockWorkspaceMessages
      }
      setAllMessages(updatedMessages)
       
      // Set as active thread if needed
      if (!activeThread) {
        setActiveThreadId(mockWorkspaceThread.id)
      }
    }
  }, [
    threads,
    setThreads,
    threadStates,
    setThreadStates,
    allMessages,
    setAllMessages,
    activeThread,
    setActiveThreadId
  ])

  return null // This component doesn't render anything
}

export default WorkspaceDemoInitializer