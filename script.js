document.addEventListener('DOMContentLoaded', () => {
   // Replace your socket initialization with:
const socket = io('https://vercel.com/arinya-mauryas-projects/real-time-chat-app', {
  transports: ['websocket'] // Force WebSocket only
}); 
    const messagesContainer = document.getElementById('messages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const statusIndicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
  
    // Prompt for username
    let username = '';
    while (!username) {
      username = prompt('Enter your username:')?.trim();
    }
  
    // Connection status
    socket.on('connect', () => {
      statusIndicator.className = 'status-online';
      statusText.textContent = 'Online';
      socket.emit('new-user', username);
    });
  
    socket.on('disconnect', () => {
      statusIndicator.className = 'status-offline';
      statusText.textContent = 'Offline';
    });
  
    // Handle incoming messages
    socket.on('receive-message', data => {
      appendMessage(data.username, data.message, false);
    });
  
    // Handle user connection notifications
    socket.on('user-connected', username => {
      appendSystemMessage(`${username} connected`);
    });
  
    // Handle user disconnection notifications
    socket.on('user-disconnected', username => {
      appendSystemMessage(`${username} disconnected`);
    });
  
    // Handle typing indicators
    socket.on('user-typing', username => {
      // You can implement a typing indicator in your UI
      console.log(`${username} is typing...`);
    });
  
    // Send message
    function sendMessage() {
      const message = messageInput.value.trim();
      if (message) {
        socket.emit('send-message', message);
        appendMessage('You', message, true);
        messageInput.value = '';
      }
    }
  
    // Send message on button click
    sendButton.addEventListener('click', sendMessage);
  
    // Send message on Enter key
    messageInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        sendMessage();
      }
      // Optional: Send typing indicator
      socket.emit('typing');
    });
  
    // Append message to chat
    function appendMessage(sender, message, isOwnMessage) {
      const messageElement = document.createElement('div');
      messageElement.className = `message ${isOwnMessage ? 'own-message' : 'other-message'}`;
      
      messageElement.innerHTML = `
        <div class="message-sender">${sender}</div>
        <div class="message-content">${message}</div>
        <div class="message-time">${new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
      `;
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  
    // Append system message
    function appendSystemMessage(text) {
      const systemMessage = document.createElement('div');
      systemMessage.className = 'system-message';
      systemMessage.textContent = text;
      messagesContainer.appendChild(systemMessage);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  });
