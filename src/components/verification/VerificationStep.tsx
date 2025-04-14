
import { ReactNode } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface VerificationStepProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

export const VerificationStep = ({ title, description, children, className = "" }: VerificationStepProps) => {
  return (
    <Card className={`w-full max-w-3xl mx-auto ${className}`}>
      <CardHeader>
        <CardTitle className="text-2xl font-serif font-bold text-wedding-800">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
};
