
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
  
  // Pages that use MobilePage component with their own navigation
  const mobilePageRoutes = ["/about", "/suppliers", "/services", "/messages", "/profile", "/bookings"];
  const usesMobilePageNav = mobilePageRoutes.some(route => location.pathname.startsWith(route));
  
  // Only show navigation when authenticated
  const showBottomNav = user && !isFullscreenPage;
  
  // Don't show top nav bar on pages that use MobilePage component or fullscreen pages
  const hideTopNav = isFullscreenPage || usesMobilePageNav || location.pathname === "/";
  
  return (
    <div className="app-shell h-full w-full flex flex-col bg-slate-50">
      {!hideTopNav && <MobileNavBar />}
      
      <main className="app-content">
        {children}
      </main>
      
      {showBottomNav && <MobileTabBar />}
    </div>
  );
}
