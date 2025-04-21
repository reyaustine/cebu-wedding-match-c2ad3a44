
import { useState, useEffect } from 'react';
import { Footer } from '@/components/Footer';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { Loader2 } from 'lucide-react';

const Messages = () => {
  const { isAuthorized, loading } = useProtectedRoute();
  
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // The hook will handle redirection
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow p-6 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-3xl font-serif font-bold text-wedding-900 mb-6">Messages</h1>
          <ChatInterface />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messages;
