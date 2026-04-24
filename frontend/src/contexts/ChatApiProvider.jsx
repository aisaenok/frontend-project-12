import { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import {
  connectSocket,
  disconnectSocket,
  initChatEvents,
  sendMessage,
  addChannel,
  removeChannelRequest,
  renameChannelRequest,
} from '../utils/socket.js'
import { ChatApiContext } from './ChatApiContext.js'

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
