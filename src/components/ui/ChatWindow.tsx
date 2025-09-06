import React, { useState, useRef, useEffect } from 'react';
import { X, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChatSession, Message } from '@/types/chat';

interface ChatWindowProps {
  chat: ChatSession;
  onClose: () => void;
  position: { bottom: number; right: number };
  sendMessage: (chatSession_id: number, messageText: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onClose,
  position,
  sendMessage,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(chat.chatSession_id, newMessage.trim());
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender_id === chat.user_id;

    return (
      <div
        key={message.message_id}
        className={`mb-4 flex ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`max-w-xs px-4 py-3 rounded-2xl text-sm ${
            isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
          }`}
        >
          <p>{message.text}</p>
          <p
            className={`text-xs mt-1 ${
              isUser ? 'text-blue-100' : 'text-gray-400'
            }`}
          >
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Full Screen Chat */}
      <div className="fixed inset-0 bg-white z-50 flex flex-col animate-slide-in-right block sm:hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="p-1 hover:bg-gray-200 transition-colors duration-150 mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h3 className="font-semibold text-gray-900">{chat.participantName}</h3>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {chat.messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-8">
              Start a conversation with {chat.participantName}
            </div>
          ) : (
            chat.messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white">
          <div className="flex space-x-3">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-full px-4"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop Chat Window */}
      <div
        className="fixed bg-white rounded-t-lg shadow-2xl border border-gray-200 animate-slide-in-right z-40 hidden sm:flex flex-col"
        style={{
          bottom: `${position.bottom}px`,
          right: `${position.right}px`,
          width: '320px',
          height: '400px',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
          <div>
            <h3 className="font-semibold text-gray-900">{chat.participantName}</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 hover:bg-gray-200 transition-colors duration-150"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
          {chat.messages.length === 0 ? (
            <div className="text-center text-gray-500 text-sm mt-8">
              Start a conversation with {chat.participantName}
            </div>
          ) : (
            chat.messages.map(renderMessage)
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
