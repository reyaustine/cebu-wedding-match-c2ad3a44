
import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, Download, FileText, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface MessageBubbleProps {
  message: ChatMessage;
  isCurrentUser: boolean;
  showAvatar: boolean;
  user?: {
    name?: string;
    photoURL?: string;
  };
}

export const MessageBubble = ({
  message,
  isCurrentUser,
  showAvatar,
  user
}: MessageBubbleProps) => {
  const [imageOpen, setImageOpen] = useState(false);
  
  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return "";
    
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      return format(date, "h:mm a");
    } catch (err) {
      return "";
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      ?.map(word => word[0])
      ?.join('')
      ?.toUpperCase() || "?";
  };
  
  // Handle attachment rendering
  const renderAttachment = () => {
    if (!message.attachmentUrl) return null;
    
    if (message.attachmentType === "image") {
      return (
        <div className="mt-2 max-w-[240px] overflow-hidden rounded-lg">
          <img
            src={message.attachmentUrl}
            alt="Attached image"
            className="w-full h-auto object-cover cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => setImageOpen(true)}
          />
        </div>
      );
    }
    
    return (
      <div className="mt-2 bg-gray-100 rounded-md p-3 flex items-center gap-3 max-w-[240px]">
        <div className="p-2 bg-white rounded-md">
          <FileText size={24} className={isCurrentUser ? "text-wedding-500" : "text-blue-500"} />
        </div>
        <div className="overflow-hidden flex-grow">
          <p className="text-sm font-medium truncate">{message.attachmentName || "File"}</p>
          <a
            href={message.attachmentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-xs flex items-center gap-1 ${isCurrentUser ? "text-wedding-700" : "text-blue-700"}`}
            download
          >
            <Download size={12} />
            <span>Download</span>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex mb-3 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      {/* Avatar (only shown for first message in a sequence) */}
      {!isCurrentUser && showAvatar && (
        <Avatar className="h-8 w-8 mr-2 mt-1 flex-shrink-0">
          <AvatarImage src={user?.photoURL || ""} />
          <AvatarFallback>
            {getInitials(user?.name || "User")}
          </AvatarFallback>
        </Avatar>
      )}
      
      {/* Empty spacer when avatar is not shown */}
      {!isCurrentUser && !showAvatar && (
        <div className="w-8 mr-2"></div>
      )}
      
      <div className={`max-w-[85%] md:max-w-[70%] flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
        {/* Message bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isCurrentUser
              ? "bg-wedding-100 text-wedding-900"
              : "bg-white border border-gray-200 text-gray-900"
          }`}
        >
          {message.text && <p className="text-sm whitespace-pre-wrap">{message.text}</p>}
          {renderAttachment()}
        </div>
        
        {/* Time and read receipt */}
        <div className="flex items-center mt-1 text-xs text-gray-500">
          <span>{formatTime(message.timestamp)}</span>
          {isCurrentUser && (
            <Check size={14} className="ml-1 text-green-500" />
          )}
        </div>
      </div>
      
      {/* Full size image dialog */}
      <Dialog open={imageOpen} onOpenChange={setImageOpen}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-transparent border-none">
          <img
            src={message.attachmentUrl}
            alt="Attached image"
            className="w-auto h-auto max-w-full max-h-full object-contain"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
