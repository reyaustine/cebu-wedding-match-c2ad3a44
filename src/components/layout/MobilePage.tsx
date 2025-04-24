
import React, { ReactNode, useEffect, useState } from 'react';
import { Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MobilePageProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  isLoading?: boolean;
  loadingText?: string;
  backButton?: boolean;
  rightAction?: ReactNode;
  fullWidth?: boolean;
  fullHeight?: boolean;
  refreshable?: boolean;
  onRefresh?: () => Promise<void>;
  headerClassName?: string;
}

export function MobilePage({
  children,
  title,
  subtitle,
  isLoading = false,
  loadingText = "Loading...",
  backButton = false,
  rightAction,
  fullWidth = false,
  fullHeight = false,
  refreshable = false,
  onRefresh,
  headerClassName
}: MobilePageProps) {
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null);

  const handleBack = () => navigate(-1);

  // Pull-to-refresh implementation
  useEffect(() => {
    if (!refreshable || !contentRef) return;

    const handleTouchStart = (e: TouchEvent) => {
      if (contentRef.scrollTop <= 0) {
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (touchStartY === 0 || contentRef.scrollTop > 0 || refreshing) return;
      
      const touchY = e.touches[0].clientY;
      const distance = Math.max(0, touchY - touchStartY);
      
      if (distance > 0) {
        setPullDistance(Math.min(80, distance));
        e.preventDefault();
      }
    };

    const handleTouchEnd = async () => {
      if (pullDistance > 60 && onRefresh && !refreshing) {
        setRefreshing(true);
        try {
          await onRefresh();
        } finally {
          setRefreshing(false);
        }
      }
      setPullDistance(0);
      setTouchStartY(0);
    };

    contentRef.addEventListener('touchstart', handleTouchStart);
    contentRef.addEventListener('touchmove', handleTouchMove, { passive: false });
    contentRef.addEventListener('touchend', handleTouchEnd);

    return () => {
      contentRef.removeEventListener('touchstart', handleTouchStart);
      contentRef.removeEventListener('touchmove', handleTouchMove);
      contentRef.removeEventListener('touchend', handleTouchEnd);
    };
  }, [refreshable, contentRef, touchStartY, pullDistance, refreshing, onRefresh]);

  return (
    <div className={cn(
      "mobile-page flex flex-col",
      fullHeight ? "h-full" : ""
    )}>
      {/* Header */}
      {(title || backButton || rightAction) && (
        <div className={cn(
          "py-4 px-4 flex items-center justify-between",
          headerClassName
        )}>
          <div className="flex items-center gap-3">
            {backButton && (
              <button 
                className="w-8 h-8 flex items-center justify-center rounded-full"
                onClick={handleBack}
              >
                <ChevronLeft size={24} />
              </button>
            )}
            
            {title && (
              <div>
                <h1 className="text-xl font-medium text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-500">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          
          {rightAction && (
            <div>{rightAction}</div>
          )}
        </div>
      )}

      {/* Content area with pull-to-refresh */}
      <div 
        className={cn(
          "relative flex-1 overflow-y-auto overflow-x-hidden",
          fullWidth ? "" : "px-4"
        )}
        style={{ paddingTop: pullDistance ? `${pullDistance}px` : undefined }}
        ref={setContentRef}
      >
        {/* Pull to refresh indicator */}
        {refreshable && pullDistance > 0 && (
          <div
            className="absolute top-0 left-0 w-full flex justify-center"
            style={{ 
              transform: `translateY(${pullDistance / 2 - 20}px)`,
              opacity: Math.min(1, pullDistance / 50)
            }}
          >
            <Loader2 
              className={cn(
                "text-wedding-500",
                refreshing ? "animate-spin" : "animate-pulse"
              )}
              size={24}
            />
          </div>
        )}

        {/* Main content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-wedding-500" />
            <p className="mt-4 text-gray-600">{loadingText}</p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

// Helper function to combine class names
function cn(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
