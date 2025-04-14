
export type ChatParticipantType = "client" | "supplier" | "planner" | "admin";

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  participantDetails?: Record<string, {
    id: string;
    name: string;
    photoURL?: string;
    role: ChatParticipantType;
  }>;
  initiatedBy: string; // User ID of the person who started the conversation
  type: "supplier" | "planner" | "admin"; // Who the client is talking to
  createdAt: any; // Firestore timestamp
  lastMessage?: {
    text: string;
    timestamp: any; // Firestore timestamp
    senderId: string;
  };
  unreadCount?: Record<string, number>; // Map of userId to unread count
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: any; // Firestore timestamp
  read: Record<string, boolean>; // Map of userId to read status
  attachmentUrl?: string;
  attachmentType?: "image" | "pdf" | "other";
  attachmentName?: string;
}
