
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CheckCircle, Shield } from "lucide-react";

interface VerifiedBadgeProps {
  size?: "sm" | "md" | "lg";
  showTooltip?: boolean;
}

export const VerifiedBadge = ({ size = "md", showTooltip = true }: VerifiedBadgeProps) => {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const badge = (
    <div className="inline-flex items-center">
      <Shield className={`${sizeClass[size]} text-green-600 fill-green-100`} />
      <CheckCircle className={`${sizeClass[size]} text-green-600 fill-white -ml-1.5`} />
    </div>
  );

  if (!showTooltip) return badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {badge}
        </TooltipTrigger>
        <TooltipContent className="bg-white p-3 shadow-lg border border-gray-200 max-w-xs">
          <div className="space-y-2">
            <p className="text-sm font-medium">Verified Supplier</p>
            <p className="text-xs text-gray-500">This supplier has gone through our verification process:</p>
            <ul className="text-xs text-gray-600 list-disc pl-4 space-y-1">
              <li>Identity verified by admin</li>
              <li>Business permits checked</li>
              <li>Portfolio reviewed</li>
              <li>Contact details confirmed</li>
            </ul>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
