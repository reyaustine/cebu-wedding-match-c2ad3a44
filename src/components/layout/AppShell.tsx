
import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { NavBar } from "../NavBar";
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
  const mobilePageRoutes = ["/suppliers", "/services", "/messages", "/profile", "/bookings"];
  const usesMobilePageNav = mobilePageRoutes.some(route => location.pathname.startsWith(route));
  
  // Only show bottom nav when authenticated
  const showBottomNav = user && !isFullscreenPage;
  
  // Show main header on home and about pages, and when not using MobilePage nav
  const showMainNav = !isFullscreenPage && !usesMobilePageNav && location.pathname !== "/dashboard";
  
  return (
    <div className="app-shell h-full w-full flex flex-col bg-slate-50">
      {showMainNav && <NavBar />}
      {!showMainNav && !isFullscreenPage && usesMobilePageNav && <MobileNavBar />}
      
      <main className="app-content flex-1">
        {children}
      </main>
      
      {showBottomNav && <MobileTabBar />}
    </div>
  );
}
