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

export const subscribeToNewMessages = (handler) => {
  socket.on('newMessage', handler);

  return () => {
    socket.off('newMessage', handler);
  };
};

export const sendMessage = (payload) => new Promise((resolve) => {
  socket.emit('newMessage', payload);
  resolve();
});

export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};

export default socket;