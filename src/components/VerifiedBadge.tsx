
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
}

export const VerifiedBadge = ({ size = "md" }: VerifiedBadgeProps) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <CheckCircle className={`${sizeClass[size]} text-green-600 fill-white`} />
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-sm">Verified Supplier</p>
          <p className="text-xs text-gray-500">Identity and credentials verified by admin</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
