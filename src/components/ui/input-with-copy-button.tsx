
import { FC, useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface InputWithCopyButtonProps {
  value: string;
  className?: string;
  readOnly?: boolean;
}

export const InputWithCopyButton: FC<InputWithCopyButtonProps> = ({
  value,
  className,
  readOnly = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className={cn("relative", className)}>
      <Input value={value} readOnly={readOnly} className="pr-10" />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-500" />
        )}
      </Button>
    </div>
  );
};
