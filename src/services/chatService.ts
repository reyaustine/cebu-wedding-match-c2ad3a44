
import { 
  collection, 
  addDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  onSnapshot,
  updateDoc,
  arrayUnion,
  Timestamp,
  setDoc,
  writeBatch,
  limit
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/config/firebase";
import { toast } from "sonner";
import { Conversation, ChatMessage } from "@/types/chat";
import { User } from "@/services/authService";

export const chatService = {
  // Create a new conversation
  createConversation: async (
    clientId: string,
    recipientId: string,
    recipientType: "supplier" | "planner" | "admin"
  ): Promise<string> => {
    try {
      // Check if conversation already exists
      const existingConvo = await chatService.findExistingConversation(clientId, recipientId);
      
      if (existingConvo) {
        return existingConvo.id;
      }
      
      // Fetch user details for both participants
      const clientDoc = await getDoc(doc(db, "users", clientId));
      const recipientDoc = await getDoc(doc(db, "users", recipientId));
      
      if (!clientDoc.exists() || !recipientDoc.exists()) {
        throw new Error("One or more participants not found");
      }
      
      const clientData = clientDoc.data() as User;
      const recipientData = recipientDoc.data() as User;
      
      // Create conversation document
      const conversationRef = await addDoc(collection(db, "conversations"), {
        participants: [clientId, recipientId],
        participantDetails: {
          [clientId]: {
            id: clientId,
            name: `${clientData.firstName} ${clientData.lastName}`,
            photoURL: clientData.photoURL || "",
            role: clientData.role
          },
          [recipientId]: {
            id: recipientId,
            name: `${recipientData.firstName} ${recipientData.lastName}`,
            photoURL: recipientData.photoURL || "",
            role: recipientData.role
          }
        },
        initiatedBy: clientId,
        type: recipientType,
        createdAt: serverTimestamp(),
        unreadCount: {
          [recipientId]: 0
        }
      });
      
      return conversationRef.id;
    } catch (error: any) {
      console.error("Error creating conversation:", error);
      toast.error("Failed to start conversation");
      throw error;
    }
  },
  
  // Find existing conversation between users
  findExistingConversation: async (
    userId1: string,
    userId2: string
  ): Promise<Conversation | null> => {
    try {
      const q = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId1)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Find conversation that contains both users
      for (const doc of querySnapshot.docs) {
        const convoData = doc.data() as Conversation;
        if (convoData.participants.includes(userId2)) {
          return {
            ...convoData,
            id: doc.id
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error finding conversation:", error);
      return null;
    }
  },
  
  // Send a message in a conversation
  sendMessage: async (
    conversationId: string,
    senderId: string,
    text: string,
    file?: File
  ): Promise<string> => {
    try {
      // Get conversation to check participants
      const convoDoc = await getDoc(doc(db, "conversations", conversationId));
      
      if (!convoDoc.exists()) {
        throw new Error("Conversation not found");
      }
      
      const convoData = convoDoc.data() as Conversation;
      
      // Check if sender is a participant
      if (!convoData.participants.includes(senderId)) {
        throw new Error("You are not a participant in this conversation");
      }
      
      // Check if conversation was initiated by a client if sender is not a client
      const senderDoc = await getDoc(doc(db, "users", senderId));
      const senderData = senderDoc.data() as User;
      
      if (senderData.role !== "client" && convoData.initiatedBy !== convoData.participants.find(id => id !== senderId)) {
        throw new Error("Only clients can initiate conversations");
      }
      
      // Handle file upload if present
      let attachmentUrl = "";
      let attachmentType = undefined;
      let attachmentName = undefined;
      
      if (file) {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        attachmentType = fileExt === 'jpg' || fileExt === 'jpeg' || fileExt === 'png' || fileExt === 'gif' ? 'image' 
                      : fileExt === 'pdf' ? 'pdf' 
                      : 'other';
                      
        const filePath = `chats/${conversationId}/${Date.now()}_${file.name}`;
        const storageRef = ref(storage, filePath);
        
        await uploadBytes(storageRef, file);
        attachmentUrl = await getDownloadURL(storageRef);
        attachmentName = file.name;
      }
      
      // Create read status object initializing all participants as unread except sender
      const readStatus: Record<string, boolean> = {};
      convoData.participants.forEach(participantId => {
        readStatus[participantId] = participantId === senderId;
      });
      
      // Add message to subcollection
      const messageRef = await addDoc(
        collection(db, "conversations", conversationId, "messages"),
        {
          senderId,
          text,
          timestamp: serverTimestamp(),
          read: readStatus,
          ...(attachmentUrl && { attachmentUrl, attachmentType, attachmentName })
        }
      );
      
      // Update conversation with last message preview
      const batch = writeBatch(db);
      
      // Update unread counters for all participants except sender
      const unreadUpdates: Record<string, number> = {};
      convoData.participants.forEach(participantId => {
        if (participantId !== senderId) {
          unreadUpdates[participantId] = (convoData.unreadCount?.[participantId] || 0) + 1;
        }
      });
      
      batch.update(doc(db, "conversations", conversationId), {
        lastMessage: {
          text: attachmentUrl ? `[${attachmentType === 'image' ? 'Image' : 'File'}] ${text || attachmentName}` : text,
          timestamp: serverTimestamp(),
          senderId
        },
        unreadCount: unreadUpdates
      });
      
      await batch.commit();
      
      return messageRef.id;
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(error.message || "Failed to send message");
      throw error;
    }
  },
  
  // Get user conversations
  getUserConversations: (userId: string, userRole: string, callback: (conversations: Conversation[]) => void) => {
    // Determine query based on user role
    let conversationsQuery;
    
    if (userRole === "client") {
      // Clients can see all their conversations
      conversationsQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId),
        orderBy("lastMessage.timestamp", "desc")
      );
    } else if (userRole === "admin") {
      // Admins can see all support conversations
      conversationsQuery = query(
        collection(db, "conversations"),
        where("type", "==", "admin"),
        orderBy("lastMessage.timestamp", "desc")
      );
    } else {
      // Suppliers and planners can only see conversations initiated by clients
      conversationsQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", userId),
        where("type", "==", userRole),
        orderBy("lastMessage.timestamp", "desc")
      );
    }
    
    // Set up real-time listener
    return onSnapshot(conversationsQuery, (snapshot) => {
      const conversations: Conversation[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Conversation);
      });
      
      callback(conversations);
    }, (error) => {
      console.error("Error getting conversations:", error);
      toast.error("Failed to load conversations");
    });
  },
  
  // Get messages in a conversation
  getConversationMessages: (conversationId: string, callback: (messages: ChatMessage[]) => void) => {
    const messagesQuery = query(
      collection(db, "conversations", conversationId, "messages"),
      orderBy("timestamp", "asc")
    );
    
    return onSnapshot(messagesQuery, (snapshot) => {
      const messages: ChatMessage[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        messages.push({
          ...data,
          id: doc.id,
          timestamp: data.timestamp?.toDate() || new Date()
        } as ChatMessage);
      });
      
      callback(messages);
    }, (error) => {
      console.error("Error getting messages:", error);
      toast.error("Failed to load messages");
    });
  },
  
  // Mark messages as read
  markMessagesAsRead: async (conversationId: string, userId: string): Promise<void> => {
    try {
      // Update the conversation document to reset unread count for this user
      await updateDoc(doc(db, "conversations", conversationId), {
        [`unreadCount.${userId}`]: 0
      });
      
      // Get messages that the user hasn't read
      const messagesQuery = query(
        collection(db, "conversations", conversationId, "messages"),
        where(`read.${userId}`, "==", false),
        limit(100) // Limit in case there are too many unread messages
      );
      
      const querySnapshot = await getDocs(messagesQuery);
      const batch = writeBatch(db);
      
      querySnapshot.forEach((doc) => {
        batch.update(doc.ref, {
          [`read.${userId}`]: true
        });
      });
      
      if (querySnapshot.size > 0) {
        await batch.commit();
      }
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  },
  
  // Get all support conversations (for admins)
  getSupportConversations: (callback: (conversations: Conversation[]) => void) => {
    const supportQuery = query(
      collection(db, "conversations"),
      where("type", "==", "admin"),
      orderBy("lastMessage.timestamp", "desc")
    );
    
    return onSnapshot(supportQuery, (snapshot) => {
      const conversations: Conversation[] = [];
      
      snapshot.forEach((doc) => {
        const data = doc.data();
        conversations.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt?.toDate() || new Date()
        } as Conversation);
      });
      
      callback(conversations);
    }, (error) => {
      console.error("Error getting support conversations:", error);
      toast.error("Failed to load support chats");
    });
  },
  
  // Create a support conversation (client to admin)
  createSupportConversation: async (clientId: string): Promise<string> => {
    try {
      // Check if user already has an active support conversation
      const supportQuery = query(
        collection(db, "conversations"),
        where("participants", "array-contains", clientId),
        where("type", "==", "admin")
      );
      
      const querySnapshot = await getDocs(supportQuery);
      
      if (!querySnapshot.empty) {
        // Return existing conversation
        return querySnapshot.docs[0].id;
      }
      
      // Get client details
      const clientDoc = await getDoc(doc(db, "users", clientId));
      
      if (!clientDoc.exists()) {
        throw new Error("User not found");
      }
      
      const clientData = clientDoc.data() as User;
      
      // Create conversation document
      const conversationRef = await addDoc(collection(db, "conversations"), {
        participants: [clientId, "support"],
        participantDetails: {
          [clientId]: {
            id: clientId,
            name: `${clientData.firstName} ${clientData.lastName}`,
            photoURL: clientData.photoURL || "",
            role: clientData.role
          },
          "support": {
            id: "support",
            name: "Wedding Match Support",
            photoURL: "",
            role: "admin"
          }
        },
        initiatedBy: clientId,
        type: "admin",
        createdAt: serverTimestamp(),
        unreadCount: {
          "support": 0
        }
      });
      
      return conversationRef.id;
    } catch (error: any) {
      console.error("Error creating support conversation:", error);
      toast.error("Failed to contact support");
      throw error;
    }
  }
};
