import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Shield, User, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";

/** Types */
export interface Message {
  message_id: number;
  chatSession_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  is_blocked?: boolean;
  sent_at?: string;
}

export interface Conversation {
  current_user_role: string;
  chatSession_id: number;
  customer_id: number;
  provider_id: number;
  customer_username?: string;
  provider_username?: string;
  messages: Message[];
}

interface UserType {
  id: number;
  name?: string;
  email?: string;
  role?: string;
}

/** Helpers */
const parseDate = (s?: string): Date | null => {
  if (!s) return null;
  let d = new Date(s);
  if (!isNaN(d.getTime())) return d;
  return null;
};

const formatTime = (s?: string) => {
  const d = parseDate(s);
  return d ? d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
};

/** Component */
const ChatBox: React.FC = () => {
  const { checkSession } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<UserType | null>(null);
  const [chats, setChats] = useState<Conversation[]>([]);
  const [chat, setChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const [loadingSend, setLoadingSend] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll
  const scrollToBottom = () => {
    if (!messagesRef.current) return;
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  };

  useEffect(() => {
    (async () => {
      const u = await checkSession();
      setUser(u);
    })();
  }, []);

  // Load chats
  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetChats.php", { withCredentials: true })
      .then((res) => {
        if (res.data.success) setChats(res.data.conversations || []);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const otherParticipantId = (c: Conversation | null) =>
    !c || !user
      ? null
      : user.role === "customer"
      ? c.provider_id
      : c.customer_id;

  const openChat = (chatId: number) => {
    const selected = chats.find((c) => c.chatSession_id === chatId) || null;
    setChat(selected);

    axios.post(
      "http://localhost/Git/Project1/Backend/MarkChatRead.php",
      { chatSession_id: chatId },
      { withCredentials: true }
    ).then(() => {
      setChats((prev) =>
        prev.map((c) =>
          c.chatSession_id === chatId
            ? { ...c, messages: c.messages.map((m) =>
                m.receiver_id === user?.id ? { ...m, is_read: true } : m
              )}
            : c
        )
      );
    });
  };


  /** Validate message content before sending */
const validateMessage = (msg: string): { valid: boolean; reason?: string } => {
  const text = msg.trim();

  // Empty check
  if (!text) {
    return { valid: false, reason: "Message cannot be empty." };
  }

  // Mobile number (basic regex: 7–15 digits, may include +, spaces, -)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\d{7,15})/;
  if (phoneRegex.test(text)) {
    return { valid: false, reason: "Sharing phone numbers is not allowed." };
  }

  // Email regex
  const emailRegex = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  if (emailRegex.test(text)) {
    return { valid: false, reason: "Sharing email addresses is not allowed." };
  }

  // Unwanted keywords
  const blockedKeywords = ["spam", "kill", "scam", "fraud", "abuse"];
  const found = blockedKeywords.find((kw) => text.toLowerCase().includes(kw));
  if (found) {
    return { valid: false, reason: `Message contains blocked keyword: "${found}".` };
  }

  // ✅ Passed all checks
  return { valid: true };
};


  const sendMessage = async () => {
    if (!chat || !user || !message.trim()) return;

    const check = validateMessage(message.trim());
  if (!check.valid) {
    toast({
      title: "Message blocked",
      description: check.reason,
      variant: "destructive",
    });
    return;
  }

    const payload = {
      chatSession_id: chat.chatSession_id,
      sender_id: user.id,
      receiver_id: otherParticipantId(chat),
      message: message.trim(),
    };

    const optimistic: Message = {
      message_id: Date.now(),
      chatSession_id: chat.chatSession_id,
      sender_id: user.id,
      receiver_id: payload.receiver_id as number,
      message: message.trim(),
      is_read: false,
      sent_at: new Date().toISOString(),
    };

    setChat((prev) => prev ? { ...prev, messages: [...prev.messages, optimistic] } : prev);
    setChats((prev) =>
      prev.map((c) =>
        c.chatSession_id === chat.chatSession_id
          ? { ...c, messages: [...c.messages, optimistic] }
          : c
      )
    );
    setMessage("");
    scrollToBottom();

    setLoadingSend(true);
    try {
      const res = await axios.post(
        "http://localhost/Git/Project1/Backend/SendMessage.php",
        payload,
        { withCredentials: true }
      );
      if (res.data.success && res.data.message) {
        const serverMsg: Message = res.data.message;
        setChats((prev) =>
          prev.map((c) =>
            c.chatSession_id === chat.chatSession_id
              ? {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.message_id === optimistic.message_id ? serverMsg : m
                  ),
                }
              : c
          )
        );
      }
    } finally {
      setLoadingSend(false);
    }
  };

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/4 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-800">Chats</h2>
          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search..."
              className="pl-9 rounded-lg bg-gray-50"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats
            .sort((a, b) => {
              const aTime = parseDate(a.messages[a.messages.length - 1]?.sent_at)?.getTime() || 0;
              const bTime = parseDate(b.messages[b.messages.length - 1]?.sent_at)?.getTime() || 0;
              return bTime - aTime;
            })
            .map((c) => {
              const unread = c.messages.filter((m) => !m.is_read && m.receiver_id === user?.id).length;
              const name = c.current_user_role === "customer" ? c.provider_username : c.customer_username;
              const lastMsg = c.messages[c.messages.length - 1]?.message || "No messages yet";
              return (
                <div
                  key={c.chatSession_id}
                  onClick={() => openChat(c.chatSession_id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition hover:bg-gray-50 ${
                    chat?.chatSession_id === c.chatSession_id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {name?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium text-gray-900 truncate">{name || "Unknown"}</h3>
                      {unread > 0 && (
                        <Badge className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {unread}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{lastMsg}</p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Conversation */}
      <div className="w-3/4 flex flex-col bg-gray-50">
        {chat ? (
          <>
            <div className="p-4 flex items-center gap-3 bg-white border-b border-gray-200">
              <Link to={user?.role === "customer" ? "/customer/dashboard" : user?.role === "provider" ? "/provider/dashboard" : "/admin/dashboard"}>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {(chat.current_user_role === "customer"
                  ? chat.provider_username?.charAt(0)
                  : chat.customer_username?.charAt(0)) || "U"}
              </div>
              <h2 className="font-semibold text-gray-900">
                {(chat.current_user_role === "customer"
                  ? chat.provider_username
                  : chat.customer_username) || "Unknown"}
              </h2>
              {user?.role === "admin" && (
                <Badge variant="secondary" className="ml-auto gap-1">
                  <Shield className="w-3 h-3" /> Admin View
                </Badge>
              )}
            </div>

            <div ref={messagesRef} className="flex-1 overflow-y-auto p-6 space-y-4">
              {chat.messages.map((m) => {
                const mine = m.sender_id === user?.id;
                return (
                  <div key={m.message_id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                        mine
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-white text-gray-800 border rounded-bl-none"
                      }`}
                    >
                      <p className="break-words">{m.message}</p>
                      <span className="text-[10px] opacity-70 block mt-1">
                        {formatTime(m.sent_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {user?.role !== "admin" && (
              <div className="p-4 border-t bg-white flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full px-4 py-3"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!message.trim() || loadingSend}
                  className="rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 flex-col">
            <User className="w-12 h-12 mb-2" />
            <p>Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;
