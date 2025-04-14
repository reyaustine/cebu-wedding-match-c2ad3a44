
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquarePlus, Search, Store, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore";
import { db } from "@/config/firebase";
import { User as FirebaseUser } from "@/services/authService";
import { chatService } from "@/services/chatService";
import { Conversation } from "@/types/chat";

interface UserListItem {
  id: string;
  firstName: string;
  lastName: string;
  photoURL?: string;
  role: string;
  businessName?: string;
  category?: string;
}

interface NewChatDialogProps {
  onSelectConversation: (conversation: Conversation) => void;
  buttonText?: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

export const NewChatDialog = ({
  onSelectConversation,
  buttonText = "New Chat",
  buttonVariant = "outline",
  buttonSize = "sm"
}: NewChatDialogProps) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suppliers, setSuppliers] = useState<UserListItem[]>([]);
  const [planners, setPlanners] = useState<UserListItem[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<UserListItem[]>([]);
  const [filteredPlanners, setFilteredPlanners] = useState<UserListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Load suppliers and planners
  useEffect(() => {
    const fetchUsers = async () => {
      if (open) {
        setIsLoading(true);
        
        try {
          // Fetch suppliers
          const suppliersQuery = query(
            collection(db, "users"),
            where("role", "==", "supplier"),
            where("verificationStatus", "==", "verified")
          );
          
          const suppliersSnapshot = await getDocs(suppliersQuery);
          const suppliersData: UserListItem[] = [];
          
          suppliersSnapshot.forEach((doc) => {
            const data = doc.data() as FirebaseUser;
            suppliersData.push({
              id: doc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              photoURL: data.photoURL,
              role: data.role,
              // Add business details if available
              businessName: (data as any).businessInfo?.businessName,
              category: (data as any).businessInfo?.category
            });
          });
          
          setSuppliers(suppliersData);
          setFilteredSuppliers(suppliersData);
          
          // Fetch planners
          const plannersQuery = query(
            collection(db, "users"),
            where("role", "==", "planner"),
            where("verificationStatus", "==", "verified")
          );
          
          const plannersSnapshot = await getDocs(plannersQuery);
          const plannersData: UserListItem[] = [];
          
          plannersSnapshot.forEach((doc) => {
            const data = doc.data() as FirebaseUser;
            plannersData.push({
              id: doc.id,
              firstName: data.firstName,
              lastName: data.lastName,
              photoURL: data.photoURL,
              role: data.role,
              // Add business details if available
              businessName: (data as any).businessInfo?.businessName
            });
          });
          
          setPlanners(plannersData);
          setFilteredPlanners(plannersData);
        } catch (error) {
          console.error("Error fetching users:", error);
          toast.error("Failed to load users");
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchUsers();
  }, [open]);
  
  // Filter users based on search term
  useEffect(() => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      
      setFilteredSuppliers(
        suppliers.filter(
          (s) =>
            `${s.firstName} ${s.lastName}`.toLowerCase().includes(term) ||
            (s.businessName && s.businessName.toLowerCase().includes(term)) ||
            (s.category && s.category.toLowerCase().includes(term))
        )
      );
      
      setFilteredPlanners(
        planners.filter(
          (p) =>
            `${p.firstName} ${p.lastName}`.toLowerCase().includes(term) ||
            (p.businessName && p.businessName.toLowerCase().includes(term))
        )
      );
    } else {
      setFilteredSuppliers(suppliers);
      setFilteredPlanners(planners);
    }
  }, [searchTerm, suppliers, planners]);
  
  // Start conversation with selected user
  const handleStartConversation = async (recipientId: string, recipientType: "supplier" | "planner" | "admin") => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      const conversationId = await chatService.createConversation(user.id, recipientId, recipientType);
      
      // Get the created conversation
      const convoDoc = await getDoc(doc(db, "conversations", conversationId));
      
      if (convoDoc.exists()) {
        const convoData = convoDoc.data();
        onSelectConversation({
          ...convoData,
          id: conversationId
        } as Conversation);
        
        setOpen(false);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
      toast.error("Failed to start conversation");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant={buttonVariant} 
          size={buttonSize}
          className={buttonSize === "icon" ? "rounded-full" : "flex items-center gap-1"}
        >
          {buttonSize === "icon" ? <MessageSquarePlus size={16} /> : (
            <>
              <MessageSquarePlus size={16} />
              <span>{buttonText}</span>
            </>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Start a conversation with a supplier or wedding planner.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              placeholder="Search by name or business" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Tabs defaultValue="suppliers" className="mt-4">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="planners">Planners</TabsTrigger>
            </TabsList>
            
            <TabsContent value="suppliers" className="mt-0">
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    Loading suppliers...
                  </div>
                ) : filteredSuppliers.length > 0 ? (
                  filteredSuppliers.map((supplier) => (
                    <div 
                      key={supplier.id}
                      className="p-3 hover:bg-gray-50 rounded-md flex items-center justify-between cursor-pointer"
                      onClick={() => handleStartConversation(supplier.id, "supplier")}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={supplier.photoURL || ""} />
                          <AvatarFallback>
                            {getInitials(`${supplier.firstName} ${supplier.lastName}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{supplier.businessName || `${supplier.firstName} ${supplier.lastName}`}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <Store size={12} />
                            <span>{supplier.category || "Supplier"}</span>
                          </div>
                        </div>
                      </div>
                      <MessageSquarePlus size={16} className="text-wedding-500" />
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">
                    No suppliers found
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="planners" className="mt-0">
              <div className="max-h-[300px] overflow-y-auto space-y-2">
                {isLoading ? (
                  <div className="py-8 text-center text-sm text-gray-500">
                    Loading wedding planners...
                  </div>
                ) : filteredPlanners.length > 0 ? (
                  filteredPlanners.map((planner) => (
                    <div 
                      key={planner.id}
                      className="p-3 hover:bg-gray-50 rounded-md flex items-center justify-between cursor-pointer"
                      onClick={() => handleStartConversation(planner.id, "planner")}
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={planner.photoURL || ""} />
                          <AvatarFallback>
                            {getInitials(`${planner.firstName} ${planner.lastName}`)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{planner.businessName || `${planner.firstName} ${planner.lastName}`}</p>
                          <div className="flex items-center gap-1 text-sm text-gray-500">
                            <UserCog size={12} />
                            <span>Wedding Planner</span>
                          </div>
                        </div>
                      </div>
                      <MessageSquarePlus size={16} className="text-wedding-500" />
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-sm text-gray-500">
                    No wedding planners found
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
