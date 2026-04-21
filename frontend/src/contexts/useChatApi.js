import { useContext } from 'react'
import { ChatApiContext } from './ChatApiContext.js'

export function useChatApi() {
  const context = useContext(ChatApiContext)

  if (!context) {
    throw new Error('useChatApi must be used within ChatApiProvider')
  }

  return context
}
