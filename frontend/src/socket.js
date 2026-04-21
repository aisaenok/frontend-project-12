import { messageReceived, channelAdded, channelRemoved, channelRenamed } from './slices/chatSlice.js'
import { io } from 'socket.io-client'

const socket = io('/', {
  autoConnect: false,
})

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect()
  }

  return socket
}

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect()
  }
}

const onNewMessage = dispatch => payload => dispatch(messageReceived(payload))
const onNewChannel = dispatch => payload => dispatch(channelAdded(payload))
const onRemoveChannel = dispatch => payload => dispatch(channelRemoved(payload))
const onRenameChannel = dispatch => payload => dispatch(channelRenamed(payload))

export const initChatEvents = (dispatch) => {
  const messageHandler = onNewMessage(dispatch)
  const channelHandler = onNewChannel(dispatch)
  const removeHandler = onRemoveChannel(dispatch)
  const renameHandler = onRenameChannel(dispatch)

  socket.on('newMessage', messageHandler)
  socket.on('newChannel', channelHandler)
  socket.on('removeChannel', removeHandler)
  socket.on('renameChannel', renameHandler)

  return () => {
    socket.off('newMessage', messageHandler)
    socket.off('newChannel', channelHandler)
    socket.off('removeChannel', removeHandler)
    socket.off('renameChannel', renameHandler)
  }
}

const emitWithAck = (event, payload) => new Promise((resolve, reject) => {
  socket.timeout(5000).emit(event, payload, (err, response) => {
    if (err) {
      reject(err)
      return
    }

    resolve(response)
  })
})

export const sendMessage = payload => emitWithAck('newMessage', payload)
export const addChannel = payload => emitWithAck('newChannel', payload)
export const removeChannelRequest = payload => emitWithAck('removeChannel', payload)
export const renameChannelRequest = payload => emitWithAck('renameChannel', payload)
