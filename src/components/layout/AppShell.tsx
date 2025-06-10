
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { MobileHeader } from "./MobileHeader";
import { MobileTabBar } from "./MobileTabBar";
import { useAuth } from "@/contexts/AuthContext";

interface AppShellProps {
  children: ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const location = useLocation();
  const { user } = useAuth();
  
  // Pages that should have a full-screen layout (no nav bars)
  const fullscreenPages = ["/login", "/register", "/verification"];
  const isFullscreenPage = fullscreenPages.some(page => location.pathname.startsWith(page));
  
  // Show mobile header on all pages except fullscreen ones
  const showMobileHeader = !isFullscreenPage;
  
  // Show bottom nav when authenticated and not on fullscreen pages
  const showBottomNav = user && !isFullscreenPage;
  
  return (
    <div className="app-shell h-full w-full flex flex-col bg-gray-50">
      {showMobileHeader && <MobileHeader />}
      
      <main className={`app-content flex-1 overflow-y-auto ${showBottomNav ? 'pb-16' : ''}`}>
        {children}
      </main>
      
      {showBottomNav && <MobileTabBar />}
    </div>
  );
}
