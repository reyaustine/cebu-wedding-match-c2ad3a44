
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Conversation, ChatMessage } from "@/types/chat";
import { chatService } from "@/services/chatService";
import { ChatList } from "@/components/chat/ChatList";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { Button } from "@/components/ui/button";
import { NewChatDialog } from "@/components/chat/NewChatDialog";
import { MessageCircle, MessageSquarePlus } from "lucide-react";

export const ChatInterface = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const messagesListener = useRef<() => void | undefined>();
  const conversationsListener = useRef<() => void | undefined>();

  useEffect(() => {
    if (!user) return;

    // Set up conversations listener
    const unsubscribe = chatService.getUserConversations(
      user.id,
      user.role,
      (convos) => {
        setConversations(convos);
        setIsLoading(false);
      }
    );

    conversationsListener.current = unsubscribe;

    return () => {
      if (conversationsListener.current) {
        conversationsListener.current();
      }
    };
  }, [user]);

  useEffect(() => {
    if (activeConversationId) {
      // Clean up previous listener
      if (messagesListener.current) {
        messagesListener.current();
      }

      // Set up messages listener
      const unsubscribe = chatService.getConversationMessages(
        activeConversationId,
        (msgs) => {
          setMessages(msgs);
        }
      );

      messagesListener.current = unsubscribe;

      // Mark messages as read
      if (user) {
        chatService.markMessagesAsRead(activeConversationId, user.id);
      }
    }

    return () => {
      if (messagesListener.current) {
        messagesListener.current();
      }
    };
  }, [activeConversationId, user]);

  // Handle selecting a conversation
  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    setActiveConversationId(conversation.id);
  };

  // Create a support conversation
  const handleContactSupport = async () => {
    if (!user) return;

    try {
      const conversationId = await chatService.createSupportConversation(user.id);
      const supportConvo = conversations.find(c => c.id === conversationId);
      
      if (supportConvo) {
        handleSelectConversation(supportConvo);
      }
    } catch (error) {
      console.error("Failed to contact support:", error);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] md:h-screen flex flex-col md:flex-row">
      {/* Chat List */}
      <div className={`
        w-full md:w-80 lg:w-96
        border-r border-gray-200
        bg-white
        ${selectedConversation ? 'hidden md:block' : 'block'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-xl font-medium">Messages</h2>
          <div className="flex items-center space-x-2">
            {user?.role === "client" && (
              <>
                <NewChatDialog onSelectConversation={handleSelectConversation} />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleContactSupport}
                  className="flex items-center gap-1"
                >
                  <MessageCircle size={16} />
                  <span className="hidden md:inline">Support</span>
                </Button>
              </>
            )}
          </div>
        </div>
        
        <ChatList 
          conversations={conversations}
          selectedConversationId={selectedConversation?.id}
          onSelectConversation={handleSelectConversation}
          isLoading={isLoading}
          currentUserId={user?.id || ""}
        />
      </div>
      
      {/* Chat Window or Empty State */}
      <div className={`
        flex-grow
        ${selectedConversation ? 'block' : 'hidden md:flex md:items-center md:justify-center'}
      `}>
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={messages}
            currentUser={user}
            onBack={() => setSelectedConversation(null)}
          />
        ) : (
          <div className="text-center p-8">
            <div className="p-6 rounded-full bg-gray-100 inline-block mb-4">
              <MessageSquarePlus size={40} className="text-wedding-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No conversation selected</h3>
            <p className="text-gray-500 max-w-md">
              {user?.role === "client" 
                ? "Select a conversation from the list or start a new one by clicking the + button"
                : "Select a conversation from the list to start chatting"}
            </p>
            {user?.role === "client" && (
              <div className="mt-6">
                <NewChatDialog 
                  onSelectConversation={handleSelectConversation}
                  buttonText="Start New Conversation" 
                  buttonVariant="default"
                  buttonSize="default"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
