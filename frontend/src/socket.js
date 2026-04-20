import { io } from 'socket.io-client';

const socket = io('/', {
  autoConnect: false,
});

export const connectSocket = () => {
  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export const subscribeToNewMessages = (handler) => {
  socket.on('newMessage', handler);
  return () => socket.off('newMessage', handler);
};

export const subscribeToNewChannels = (handler) => {
  socket.on('newChannel', handler);
  return () => socket.off('newChannel', handler);
};

export const subscribeToRemovedChannels = (handler) => {
  socket.on('removeChannel', handler);
  return () => socket.off('removeChannel', handler);
};

export const subscribeToRenamedChannels = (handler) => {
  socket.on('renameChannel', handler);
  return () => socket.off('renameChannel', handler);
};

const emitWithAck = (event, payload) => new Promise((resolve, reject) => {
  socket.timeout(5000).emit(event, payload, (err, response) => {
    if (err) {
      reject(err);
      return;
    }

    resolve(response);
  });
});

export const sendMessage = (payload) => emitWithAck('newMessage', payload);
export const addChannel = (payload) => emitWithAck('newChannel', payload);
export const removeChannelRequest = (payload) => emitWithAck('removeChannel', payload);
export const renameChannelRequest = (payload) => emitWithAck('renameChannel', payload);