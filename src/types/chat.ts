// src/types/chat.ts

export interface Message {
  message_id: number;
  chatSession_id: number;
  sender_id: number;
  receiver_id: number;
  text: string;
  is_read: number;
  timestamp: Date;
}


export interface ChatSession {
  chatSession_id: number;
  user_id: number;
  participantName: string;
  messages: Message[];
  isOpen: boolean;
  sender_id: number;
  lastActivity: Date;
}
