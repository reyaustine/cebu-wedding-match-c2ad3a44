
import { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2 } from 'lucide-react';
import { MobileLayout } from '@/components/layout/MobileLayout';

const Messages = () => {
  const { isAuthorized, loading } = useProtectedRoute();
  
  if (loading) {
    return (
      <MobileLayout isLoading={true} loadingText="Loading messages...">
        <></>
      </MobileLayout>
    );
  }

  if (!isAuthorized) {
    return null; // The hook will handle redirection
  }

  return (
    <MobileLayout title="Messages">
      <div className="h-[calc(100vh-7rem)]">
        <ChatInterface />
      </div>
    </MobileLayout>
  );
};

export default Messages;
