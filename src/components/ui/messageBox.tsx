import React, { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, Send, Shield, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";

/**
 * Message and Conversation models (expanded to include admin-block flag)
 */
export interface Message {
  message_id: number;
  chatSession_id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  is_blocked?: boolean; // admin blocked flag
  sent_at: string; 
  // sent_at:Date;
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

interface User {
  id: number;
  name?: string;
  email?: string;
  role?: string; // 'customer' | 'provider' | 'admin'
}

const MessageBox: React.FC = () => {
  const { checkSession } = useAuth();
  const { toast } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [chatsAll, setChatsAll] = useState<Conversation[]>([]);
  const [chat, setChat] = useState<Conversation | null>(null);
  const [message, setMessage] = useState("");
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const [loadingSend, setLoadingSend] = useState(false);

  // scroll to bottom helper
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

  // load chats
  useEffect(() => {
    axios
      .get("http://localhost/Git/Project1/Backend/GetChats.php", { withCredentials: true })
      .then((res) => {
        const data = res.data;
        if (data.success) {
          setChatsAll(data.conversations || []);
        } else {
          console.error("Failed loading chats:", data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // keep chat in sync
  useEffect(() => {
    if (!chat) return;
    const fresh = chatsAll.find((c) => c.chatSession_id === chat.chatSession_id) || null;
    setChat(fresh);
  }, [chatsAll]);

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  // utility: detect email or phone number
  const containsCredentials = (text: string) => {
    if (!text) return false;
    const emailRegex = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
    const phoneRegex = /(?:\+?\d[\d ()-]{6,}\d)/;
    return emailRegex.test(text) || phoneRegex.test(text);
  };

  const otherParticipantId = (conversation: Conversation | null) => {
    if (!conversation || !user) return null;
    return user.role === "customer" ? conversation.provider_id : conversation.customer_id;
  };

  const getChat = (chatId: number) => {
    const selected = chatsAll.find((c) => c.chatSession_id === chatId) || null;
    setChat(selected);

    axios
      .post(
        "http://localhost/Git/Project1/Backend/MarkChatRead.php",
        { chatSession_id: chatId },
        { withCredentials: true }
      )
      .catch((err) => console.warn("Failed to mark read:", err));
  };
  const formatLocalDateTime = (date: Date) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
};


  // handle send message
  const handleSendMessage = async () => {
    if (!chat || !user) return;

    const trimmed = message.trim();
    if (!trimmed) return;

    if (containsCredentials(trimmed)) {
      toast({
        title: "Can't send contact details",
        description: "Messages cannot contain phone numbers or email addresses.",
        variant: "destructive",
      });
      return;
    }

    const restrictedKeywords = ["spam", "offensive", "blocked"];
    if (restrictedKeywords.some((k) => trimmed.toLowerCase().includes(k))) {
      toast({ title: "Message blocked", description: "Your message contains restricted content.", variant: "destructive" });
      return;
    }

    const payload = {
      chatSession_id: chat.chatSession_id,
      sender_id: user.id,
      receiver_id: otherParticipantId(chat),
      message: trimmed,
      // sent_at: new Date().toISOString(),
      // sent_at:formatLocalDateTime(new Date()),
    };
function formatDateToDB(date: Date): string {
  const offset = date.getTimezoneOffset(); // in minutes
  const local = new Date(date.getTime() - offset * 60000); // adjust to local time
  return local.slice(0, 19).replace("T", " ");
}
const sent_at=formatDateToDB(new Date());

    // ✅ optimistic UI message
    const optimisticMessage: Message = {
      message_id: Date.now(),
      chatSession_id: chat.chatSession_id,
      sender_id: user.id, // ✅ ensures alignment
      receiver_id: payload.receiver_id as number,
      message: trimmed,
      is_read: false,
      is_blocked: false,
      sent_at: sent_at,
    };
    console.log(optimisticMessage);

    setChat((prev) =>
      prev ? { ...prev, messages: [...prev.messages, optimisticMessage] } : prev
    );
    setChatsAll((prev) =>
      prev.map((c) =>
        c.chatSession_id === chat.chatSession_id
          ? { ...c, messages: [...c.messages, optimisticMessage] }
          : c
      )
    );
    setMessage("");
    scrollToBottom();

    setLoadingSend(true);
    try {
      const res = await axios.post("http://localhost/Git/Project1/Backend/SendMessage.php", payload, { withCredentials: true });
      const data = res.data;
      if (data.success && data.message) {
        const serverMessage: Message = { ...data.message };
        setChatsAll((prev) =>
          prev.map((c) =>
            c.chatSession_id !== chat.chatSession_id
              ? c
              : {
                  ...c,
                  messages: c.messages.map((m) =>
                    m.message_id === optimisticMessage.message_id ? serverMessage : m
                  ),
                }
          )
        );
        setChat((prev) =>
          prev
            ? {
                ...prev,
                messages: prev.messages.map((m) =>
                  m.message_id === optimisticMessage.message_id ? serverMessage : m
                ),
              }
            : prev
        );
        toast({ title: "Message sent" });
      } else {
        // remove optimistic message
        setChatsAll((prev) =>
          prev.map((c) =>
            c.chatSession_id === chat.chatSession_id
              ? { ...c, messages: c.messages.filter((m) => m.message_id !== optimisticMessage.message_id) }
              : c
          )
        );
        setChat((prev) =>
          prev
            ? { ...prev, messages: prev.messages.filter((m) => m.message_id !== optimisticMessage.message_id) }
            : prev
        );
        toast({ title: "Failed to send", description: data?.error || "Unknown error", variant: "destructive" });
      }
    } catch (err) {
      setChatsAll((prev) =>
        prev.map((c) =>
          c.chatSession_id === chat.chatSession_id
            ? { ...c, messages: c.messages.filter((m) => m.message_id !== optimisticMessage.message_id) }
            : c
        )
      );
      setChat((prev) =>
        prev
          ? { ...prev, messages: prev.messages.filter((m) => m.message_id !== optimisticMessage.message_id) }
          : prev
      );
      toast({ title: "Network error", description: "Failed to send message.", variant: "destructive" });
    } finally {
      setLoadingSend(false);
    }
  };

  const renderMessageBubble = (msg: Message) => {
    const mine = msg.sender_id === user?.id; // ✅ alignment is now reliable
    if (msg.is_blocked) {
      return (
        <div className="max-w-xs lg:max-w-md px-4 py-3 rounded-2xl bg-gray-100 text-gray-500 italic border border-gray-200">
          <p className="text-sm">Message blocked by admin</p>
          <p className="text-xs mt-1 opacity-80">(content hidden)</p>
        </div>
      );
    }

    return (
      <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${mine ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" : "bg-white text-gray-900 shadow-sm border border-gray-200"}`}>
        <div className="flex flex-col">
          <p className="leading-relaxed break-words">{msg.message}</p>
          <p className="text-xs opacity-75 mt-2">{new Date(msg.sent_at).toLocaleString()}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col md:flex-row gap-4 p-4">
      {/* Sidebar */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 md:w-1/3 lg:w-1/4 h-full overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Messages</h2>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="Search conversations..." className="pl-10 bg-gray-50 border-gray-200" />
          </div>
        </div>
        <div className="overflow-y-auto max-h-[calc(100vh-180px)]">
          {chatsAll
            .sort((a, b) => {
              const aLast = a.messages.length ? new Date(a.messages[a.messages.length - 1].sent_at).getTime() : 0;
              const bLast = b.messages.length ? new Date(b.messages[b.messages.length - 1].sent_at).getTime() : 0;
              return bLast - aLast;
            })
            .map((chatItem) => (
              <div key={chatItem.chatSession_id} className={`p-4 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${chat?.chatSession_id === chatItem.chatSession_id ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`} onClick={() => getChat(chatItem.chatSession_id)}>
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {chatItem.provider_username?.charAt(0) || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{(chatItem.current_user_role === "customer" ? chatItem.provider_username : chatItem.customer_username) || "Unknown User"}</h3>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">{chatItem.messages.length > 0 && new Date(chatItem.messages[chatItem.messages.length - 1].sent_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                        {chatItem.messages.filter((m) => !m.is_read && m.receiver_id === user?.id).length > 0 && (
                          <Badge className="bg-blue-500 text-white px-1.5 py-0.5 text-xs min-w-[20px] flex justify-center">{chatItem.messages.filter((m) => !m.is_read && m.receiver_id === user?.id).length}</Badge>
                        )}
                      </div>
                    </div>
                    {chatItem.messages.slice(-1).map((msg) => (
                      <div key={msg.message_id} className="flex items-center gap-2">
                        <p className="text-sm text-gray-600 truncate flex-1">{msg.is_blocked ? "Message blocked" : msg.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Conversation */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 flex-1 flex flex-col">
        {chat ? (
          <>
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-gray-50">
              <div className="flex items-center gap-3">
                <Link to={user?.role === "customer" ? "/customer/dashboard" : user?.role === "provider" ? "/provider/dashboard" : "/admin/dashboard"}>
                  <Button variant="ghost" size="sm" className="rounded-full">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                </Link>
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {(chat.current_user_role === "customer" ? chat.provider_username?.charAt(0) : chat.customer_username?.charAt(0)) || "U"}
                </div>
                <h2 className="font-semibold text-gray-900">
                  Chat with {(chat.current_user_role === "customer" ? chat.provider_username : chat.customer_username) || "Unknown"}
                </h2>
              </div>
              {user?.role === "admin" && (
                <Badge variant="secondary" className="gap-1"><Shield className="w-3 h-3" />Admin View</Badge>
              )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <div ref={messagesRef} className="overflow-y-auto p-4 bg-gray-50" style={{ maxHeight: "calc(100vh - 240px)" }}>
                <div className="max-w-4xl mx-auto space-y-4">
                  {chat.messages.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"><Send className="w-8 h-8 text-gray-400" /></div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">No messages yet</h3>
                      <p className="text-gray-500">Start the conversation by sending a message</p>
                    </div>
                  ) : (
                    chat.messages.map((msg) => (
                      <div key={msg.message_id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
                        {renderMessageBubble(msg)}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {user?.role !== "admin" && (
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="max-w-4xl mx-auto flex gap-2">
                    <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message..." className="flex-1 rounded-full px-4 py-3" onKeyDown={(e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }} />
                    <Button onClick={handleSendMessage} disabled={!message.trim() || loadingSend} className="rounded-full px-6 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6"><User className="w-12 h-12 text-gray-400" /></div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a conversation</h3>
              <p className="text-gray-500 mb-6">Choose a chat from the sidebar to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBox;
