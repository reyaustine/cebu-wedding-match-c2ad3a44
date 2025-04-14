
import { useEffect, useState } from "react";
import { Conversation } from "@/types/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Check, Badge, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface ChatListProps {
  conversations: Conversation[];
  selectedConversationId?: string;
  onSelectConversation: (conversation: Conversation) => void;
  isLoading: boolean;
  currentUserId: string;
}

export const ChatList = ({
  conversations,
  selectedConversationId,
  onSelectConversation,
  isLoading,
  currentUserId
}: ChatListProps) => {
  const { user } = useAuth();
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  
  useEffect(() => {
    // Sort conversations by last message timestamp (most recent first)
    const sortedConversations = [...conversations].sort((a, b) => {
      const timeA = a.lastMessage?.timestamp?.toMillis?.() || a.createdAt?.toMillis?.() || 0;
      const timeB = b.lastMessage?.timestamp?.toMillis?.() || b.createdAt?.toMillis?.() || 0;
      return timeB - timeA;
    });
    
    setFilteredConversations(sortedConversations);
  }, [conversations]);

  // Get other user data in a conversation
  const getOtherUser = (conversation: Conversation) => {
    if (!user) return null;
    
    if (conversation.type === "admin" && user.role !== "admin") {
      return {
        name: "Support Team",
        photoURL: "",
        role: "admin"
      };
    }
    
    if (conversation.type === "admin" && user.role === "admin") {
      // Find the client in this support conversation
      const clientId = conversation.participants.find(id => id !== "support");
      return conversation.participantDetails?.[clientId || ""] || {
        name: "Client",
        photoURL: "",
        role: "client"
      };
    }
    
    // For normal conversations, find the other participant
    const otherUserId = conversation.participants.find(id => id !== currentUserId);
    return conversation.participantDetails?.[otherUserId || ""] || null;
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (err) {
      return "";
    }
  };

  if (isLoading) {
    return (
      <div className="py-8 px-4">
        <div className="flex flex-col space-y-4">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (filteredConversations.length === 0) {
    return (
      <div className="py-12 px-4 text-center">
        <div className="p-4 rounded-full bg-gray-100 inline-block mb-3">
          <Users size={24} className="text-gray-400" />
        </div>
        <h3 className="text-gray-800 font-medium mb-1">No conversations yet</h3>
        <p className="text-gray-500 text-sm">
          {user?.role === "client" 
            ? "Start a new conversation by clicking the + button above"
            : "Conversations with clients will appear here"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-[calc(100%-4rem)]">
      {filteredConversations.map((conversation) => {
        const otherUser = getOtherUser(conversation);
        const isSelected = selectedConversationId === conversation.id;
        const unreadCount = conversation.unreadCount?.[currentUserId] || 0;
        
        return (
          <div
            key={conversation.id}
            className={`
              p-4 border-b border-gray-100 cursor-pointer transition-colors
              ${isSelected ? "bg-wedding-50" : "hover:bg-gray-50"}
            `}
            onClick={() => onSelectConversation(conversation)}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={otherUser?.photoURL || ""} alt={otherUser?.name || "User"} />
                  <AvatarFallback>
                    {otherUser?.name ? getInitials(otherUser.name) : "?"}
                  </AvatarFallback>
                </Avatar>
                {otherUser?.role === "admin" && (
                  <div className="absolute -bottom-1 -right-1 bg-wedding-100 text-wedding-800 p-1 rounded-full border border-white">
                    <Badge size={10} />
                  </div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm text-gray-900 truncate">
                    {otherUser?.name || "Unknown"}
                  </h4>
                  <span className="text-xs text-gray-500">
                    {formatTime(conversation.lastMessage?.timestamp || conversation.createdAt)}
                  </span>
                </div>
                
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-600 truncate max-w-[70%]">
                    {conversation.lastMessage?.text || "No messages yet"}
                  </p>
                  
                  {unreadCount > 0 ? (
                    <span className="rounded-full bg-wedding-500 text-white text-xs px-2 py-0.5 min-w-[1.5rem] text-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  ) : conversation.lastMessage?.senderId === currentUserId && (
                    <Check size={16} className="text-green-500" />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
