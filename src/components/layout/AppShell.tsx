
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { MobileNavBar } from "./MobileNavBar"; 
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
  
  // Auth pages that should have a different layout (only top navbar)
  const authPages = ["/", "/about", "/suppliers"];
  const isAuthPage = authPages.some(page => location.pathname === page);
  
  // Only show navigation when authenticated
  const showBottomNav = user && !isFullscreenPage;
  const showTopNav = (isAuthPage || !user) && !isFullscreenPage;
  
  return (
    <div className="app-shell h-full w-full flex flex-col bg-slate-50">
      {showTopNav && <MobileNavBar />}
      
      <main className="app-content">
        {children}
      </main>
      
      {showBottomNav && <MobileTabBar />}
    </div>
  );
}
