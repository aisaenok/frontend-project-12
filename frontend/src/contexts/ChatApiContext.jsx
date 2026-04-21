import { createContext, useContext, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
  connectSocket,
  disconnectSocket,
  initChatEvents,
  sendMessage,
  addChannel,
  removeChannelRequest,
  renameChannelRequest,
} from '../socket.js'

const ChatApiContext = createContext(null)

export function ChatApiProvider({ children }) {
  const dispatch = useDispatch()

  useEffect(() => {
    connectSocket()
    const cleanup = initChatEvents(dispatch)

    return () => {
      cleanup()
      disconnectSocket()
    }
  }, [dispatch])

  const value = useMemo(() => ({
    sendMessage,
    addChannel,
    removeChannel: removeChannelRequest,
    renameChannel: renameChannelRequest,
  }), [])

  return (
    <ChatApiContext.Provider value={value}>
      {children}
    </ChatApiContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useChatApi() {
  const context = useContext(ChatApiContext)

  if (!context) {
    throw new Error('useChatApi must be used within ChatApiProvider')
  }

  return context
}
