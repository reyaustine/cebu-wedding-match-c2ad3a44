
import { useState } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { MobilePage } from '@/components/layout/MobilePage';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Messages = () => {
  const { isAuthorized, loading } = useProtectedRoute();
  const [refreshing, setRefreshing] = useState(false);
  
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate a refresh
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
  };
  
  if (loading || !isAuthorized) {
    return (
      <MobilePage isLoading loadingText="Loading messages...">
        <></>
      </MobilePage>
    );
  }

  return (
    <MobilePage 
      title="Messages"
      refreshable
      onRefresh={handleRefresh}
      isLoading={refreshing}
      loadingText="Refreshing messages..."
      fullHeight
      rightAction={
        <Button size="icon" variant="ghost" className="rounded-full">
          <Plus size={20} />
        </Button>
      }
    >
      <div className="h-[calc(100vh-7rem)]">
        <ChatInterface />
      </div>
    </MobilePage>
  );
};

export default Messages;
