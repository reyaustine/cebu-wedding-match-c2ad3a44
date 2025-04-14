
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, X } from "lucide-react";
import { toast } from "sonner";

interface ChatInputProps {
  onSendMessage: (text: string, file?: File) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput = ({
  onSendMessage,
  disabled = false,
  placeholder = "Type a message..."
}: ChatInputProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Handle sending a message
  const handleSend = () => {
    if (disabled) return;
    
    const trimmedMessage = message.trim();
    if (!trimmedMessage && !selectedFile) return;
    
    onSendMessage(trimmedMessage, selectedFile || undefined);
    setMessage("");
    setSelectedFile(null);
    setFilePreview(null);
    
    // Focus the textarea after sending
    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };
  
  // Handle key press events for sending with Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 5MB.");
      return;
    }
    
    setSelectedFile(file);
    
    // Create file preview
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };
  
  // Handle file attachment button click
  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };
  
  // Clear selected file
  const handleClearFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="relative">
      {/* File preview (if any) */}
      {selectedFile && (
        <div className="mb-2 p-2 bg-gray-100 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            {filePreview ? (
              <img
                src={filePreview}
                alt="Preview"
                className="w-10 h-10 object-cover rounded"
              />
            ) : (
              <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-xs text-gray-500">{selectedFile.name.split('.').pop()}</span>
              </div>
            )}
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleClearFile}
          >
            <X size={16} />
          </Button>
        </div>
      )}
      
      {/* Input area */}
      <div className="flex items-end gap-2">
        <div className="relative flex-grow">
          <Textarea
            placeholder={disabled ? "You cannot send messages in this conversation" : placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none min-h-[80px] pr-12 py-3"
            disabled={disabled}
            ref={textareaRef}
          />
          
          {/* Attachment button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 bottom-3 h-8 w-8 text-gray-500"
            onClick={handleAttachmentClick}
            disabled={disabled}
          >
            <Paperclip size={18} />
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
            />
          </Button>
        </div>
        
        {/* Send button */}
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={disabled || (!message.trim() && !selectedFile)}
          className={`rounded-full h-10 w-10 ${
            disabled || (!message.trim() && !selectedFile)
              ? "bg-gray-300 hover:bg-gray-300"
              : "bg-wedding-500 hover:bg-wedding-600"
          }`}
        >
          <Send size={18} className="text-white" />
        </Button>
      </div>
    </div>
  );
};
