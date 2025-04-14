
import { useEffect, useRef, useState } from "react";
import { Conversation, ChatMessage } from "@/types/chat";
import { User } from "@/services/authService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatInput } from "@/components/chat/ChatInput";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronDown, Info } from "lucide-react";
import { chatService } from "@/services/chatService";
import { format } from "date-fns";

interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessage[];
  currentUser: User | null;
  onBack: () => void;
}

export const ChatWindow = ({
  conversation,
  messages,
  currentUser,
  onBack
}: ChatWindowProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showScrollDown, setShowScrollDown] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  
  // Get other user data in conversation
  const getOtherUser = () => {
    if (!currentUser) return null;
    
    if (conversation.type === "admin" && currentUser.role !== "admin") {
      return {
        name: "Support Team",
        photoURL: "",
        role: "admin"
      };
    }
    
    if (conversation.type === "admin" && currentUser.role === "admin") {
      // Find the client in this support conversation
      const clientId = conversation.participants.find(id => id !== "support");
      return conversation.participantDetails?.[clientId || ""] || {
        name: "Client",
        photoURL: "",
        role: "client"
      };
    }
    
    // For normal conversations, find the other participant
    const otherUserId = conversation.participants.find(id => id !== currentUser.id);
    return conversation.participantDetails?.[otherUserId || ""] || null;
  };
  
  const otherUser = getOtherUser();
  
  // Group messages by date
  const groupedMessages = messages.reduce<{
    [date: string]: ChatMessage[];
  }>((groups, message) => {
    const date = format(
      message.timestamp instanceof Date ? message.timestamp : new Date(message.timestamp),
      'MMMM d, yyyy'
    );
    
    if (!groups[date]) {
      groups[date] = [];
    }
    
    groups[date].push(message);
    return groups;
  }, {});
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  // Handle scroll events to show/hide scroll down button
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const scrollBottom = scrollHeight - scrollTop - clientHeight;
    
    setShowScrollDown(scrollBottom > 300);
    setIsNearBottom(scrollBottom < 50);
  };
  
  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Auto scroll to bottom on new messages if already near bottom
  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);
  
  // Set up scroll event listener
  useEffect(() => {
    const container = messagesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);
  
  // Initial scroll to bottom
  useEffect(() => {
    scrollToBottom();
    
    if (currentUser && conversation.id) {
      chatService.markMessagesAsRead(conversation.id, currentUser.id);
    }
  }, [conversation.id, currentUser]);
  
  // Handle sending a message
  const handleSendMessage = async (text: string, file?: File) => {
    if (!currentUser || !text.trim()) return;
    
    try {
      await chatService.sendMessage(conversation.id, currentUser.id, text, file);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };
  
  // Check if user can send messages (clients can always send, others only if client initiated)
  const canSendMessage = () => {
    if (!currentUser) return false;
    
    if (currentUser.role === "client") {
      return true;
    }
    
    return conversation.initiatedBy !== currentUser.id;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onBack}
          >
            <ArrowLeft size={20} />
          </Button>
          
          <Avatar className="h-10 w-10">
            <AvatarImage src={otherUser?.photoURL || ""} alt={otherUser?.name || "User"} />
            <AvatarFallback>
              {otherUser?.name ? getInitials(otherUser.name) : "?"}
            </AvatarFallback>
          </Avatar>
          
          <div>
            <h3 className="font-medium">{otherUser?.name || "Unknown"}</h3>
            <p className="text-xs text-gray-500 capitalize">
              {conversation.type === "admin" ? "Support" : conversation.type}
            </p>
          </div>
        </div>
        
        <Button variant="ghost" size="icon">
          <Info size={20} />
        </Button>
      </div>
      
      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-grow overflow-y-auto p-4 bg-gray-50"
      >
        {/* Welcome message if no messages */}
        {messages.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm">
              This is the beginning of your conversation with {otherUser?.name || "this user"}.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              {canSendMessage() ? "Type a message below to get started." : "Waiting for a message..."}
            </p>
          </div>
        )}
        
        {/* Message groups by date */}
        {Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date}>
            <div className="flex justify-center my-4">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs text-gray-600">
                {date}
              </span>
            </div>
            
            {dateMessages.map((message, index) => (
              <MessageBubble
                key={message.id}
                message={message}
                isCurrentUser={currentUser?.id === message.senderId}
                showAvatar={
                  index === 0 || 
                  dateMessages[index - 1]?.senderId !== message.senderId
                }
                user={conversation.participantDetails?.[message.senderId]}
              />
            ))}
          </div>
        ))}
        
        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollDown && (
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-24 right-8 rounded-full shadow-md bg-white"
          onClick={scrollToBottom}
        >
          <ChevronDown size={20} />
        </Button>
      )}
      
      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-200">
        <ChatInput 
          onSendMessage={handleSendMessage} 
          disabled={!canSendMessage()}
          placeholder={
            canSendMessage()
              ? "Type a message..."
              : "You cannot send messages in this conversation"
          }
        />
      </div>
    </div>
  );
};
