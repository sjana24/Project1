
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export interface ChatRequest {
  id: number;
  customerId:  number;
  customerName: string;
  providerId:  number;
  providerName: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

export interface Message {
  id: number;
  
  chatId:  number;
  senderId:  number;
  senderName: string;
  content: string;
  timestamp: string;
  isBlocked?: boolean;
}

export interface Chat {
  id: number;
  customerId:  number;
  customerName: string;
  providerId:  number;
  providerName: string;
  messages: Message[];
  isActive: boolean;
}

interface ChatContextType {
  chatRequests: ChatRequest[];
  chats: Chat[];
  sendChatRequest: (providerId:  number, providerName: string) => void;
  acceptChatRequest: (requestId:  number) => void;
  rejectChatRequest: (requestId:  number) => void;
  sendMessage: (chatId:  number, content: string) => void;
  getChat: (chatId:  number) => Chat | undefined;
  getUserChats: () => Chat[];
  getUserChatRequests: () => ChatRequest[];
  getAllChats: () => Chat[];
  blockMessage: (messageId:  number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

const RESTRICTED_KEYWORDS = ['spam', 'scam', 'fraud', 'hack', 'illegal', 'drugs'];

const containsRestrictedContent = (message: string): boolean => {
  return RESTRICTED_KEYWORDS.some(keyword => 
    message.toLowerCase().includes(keyword.toLowerCase())
  );
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [chatRequests, setChatRequests] = useState<ChatRequest[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const savedRequests = localStorage.getItem('chatRequests');
    const savedChats = localStorage.getItem('chats');
    
    if (savedRequests) setChatRequests(JSON.parse(savedRequests));
    if (savedChats) setChats(JSON.parse(savedChats));
  }, []);

  useEffect(() => {
    localStorage.setItem('chatRequests', JSON.stringify(chatRequests));
  }, [chatRequests]);

  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const sendChatRequest = (providerId:  number, providerName: string) => {
    if (!user) return;

    const newRequest: ChatRequest = {
      id: Date.now(),
      customerId: user.id,
      customerName: user.name,
      providerId,
      providerName,
      status: 'pending',
      timestamp: new Date().toISOString()
    };

    setChatRequests(prev => [...prev, newRequest]);
  };

  const acceptChatRequest = (requestId:  number) => {
    const request = chatRequests.find(r => r.id === requestId);
    if (!request) return;

    // Create new chat
    const newChat: Chat = {
      id: Date.now(),
      customerId: request.customerId,
      customerName: request.customerName,
      providerId: request.providerId,
      providerName: request.providerName,
      messages: [],
      isActive: true
    };

    setChats(prev => [...prev, newChat]);
    setChatRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'accepted' as const } : r
    ));
  };

  const rejectChatRequest = (requestId: number) => {
    setChatRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' as const } : r
    ));
  };

  const sendMessage = (chatId:  number, content: string) => {
    if (!user) return;

    const isBlocked = containsRestrictedContent(content);
    
    const newMessage: Message = {
      id: Date.now(),
      chatId,
      senderId: user.id,
      senderName: user.name,
      content,
      timestamp: new Date().toISOString(),
      isBlocked
    };

    setChats(prev => prev.map(chat => 
      chat.id === chatId 
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
  };

  const blockMessage = (messageId:  number) => {
    setChats(prev => prev.map(chat => ({
      ...chat,
      messages: chat.messages.map(msg => 
        msg.id === messageId ? { ...msg, isBlocked: true } : msg
      )
    })));
  };

  const getChat = (chatId:  number) => {
    return chats.find(chat => chat.id === chatId);
  };

  const getUserChats = () => {
    if (!user) return [];
    return chats.filter(chat => 
      chat.customerId === user.id || chat.providerId === user.id
    );
  };

  const getUserChatRequests = () => {
    if (!user) return [];
    
    if (user.role === 'customer') {
      return chatRequests.filter(req => req.customerId === user.id);
    } else if (user.role === 'provider') {
      return chatRequests.filter(req => req.providerId === user.id);
    }
    
    return [];
  };

  const getAllChats = () => {
    return chats;
  };

  return (
    <ChatContext.Provider value={{
      chatRequests,
      chats,
      sendChatRequest,
      acceptChatRequest,
      rejectChatRequest,
      sendMessage,
      getChat,
      getUserChats,
      getUserChatRequests,
      getAllChats,
      blockMessage
    }}>
      {children}
    </ChatContext.Provider>
  );
};
