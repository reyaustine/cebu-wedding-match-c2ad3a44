
import React from "react";
import { Footer } from "@/components/Footer";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  loadingText?: string;
  backAction?: () => void;
  rightAction?: React.ReactNode;
}

export function MobileLayout({
  children,
  title,
  subtitle,
  isLoading = false,
  loadingText = "Loading...",
  backAction,
  rightAction,
}: MobileLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      {(title || backAction || rightAction) && (
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {backAction && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={backAction}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-arrow-left"
                  >
                    <path d="m12 19-7-7 7-7" />
                    <path d="M19 12H5" />
                  </svg>
                </Button>
              )}
              
              {title && (
                <div>
                  <h1 className="text-lg font-serif font-bold text-wedding-800 line-clamp-1">
                    {title}
                  </h1>
                  {subtitle && (
                    <p className="text-xs text-gray-500 line-clamp-1">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
            
            {rightAction && (
              <div>{rightAction}</div>
            )}
          </div>
        </header>
      )}

      {/* Main content */}
      <main className="flex-grow">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">{loadingText}</p>
          </div>
        ) : (
          children
        )}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
