
import React, { useState } from 'react';
import { PersonalInfo, BusinessInfo, ServiceInfo, UserRole } from "@/services/authService";

interface VerificationContainerProps {
  userId: string;
  userRole: UserRole;
  currentStep: number;
  personalInfo: PersonalInfo | null;
  businessInfo: BusinessInfo | null;
  serviceInfo: ServiceInfo | null;
  onPersonalInfoSave: (data: PersonalInfo) => Promise<void>;
  onBusinessInfoSave: (data: BusinessInfo) => Promise<void>;
  onServiceInfoSave: (data: ServiceInfo) => Promise<void>;
  onSubmitVerification: () => Promise<void>;
  onChangeStep: (step: number) => void;
  children: React.ReactNode;
}

export const VerificationContainer: React.FC<VerificationContainerProps> = ({
  userId,
  userRole,
  currentStep,
  children
}) => {
  const totalSteps = userRole === "client" ? 2 : 4;
  
  const renderStepIndicator = () => {
    return (
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-2">
          {[...Array(totalSteps)].map((_, index) => {
            const stepNumber = index + 1;
            const isActive = currentStep === stepNumber;
            const isCompleted = currentStep > stepNumber;
            
            return (
              <div key={`step-${stepNumber}`} className="flex items-center">
                {index > 0 && (
                  <div 
                    className={`h-1 w-6 mx-1 ${
                      isCompleted ? "bg-wedding-600" : "bg-gray-200"
                    }`}
                  />
                )}
                
                <div 
                  className={`rounded-full flex items-center justify-center h-8 w-8 text-sm font-medium ${
                    isActive 
                      ? "bg-wedding-600 text-white"
                      : isCompleted
                        ? "bg-wedding-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {stepNumber}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12">
        <div className="container px-4 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-serif font-bold text-wedding-800">
              Account Verification
            </h1>
            <p className="text-muted-foreground mt-2">
              {userRole === "client" 
                ? "Verify your account to start using TheWeddingMatch" 
                : "Complete your verification to join our network of trusted wedding professionals"}
            </p>
          </div>
          
          {renderStepIndicator()}
          {children}
        </div>
      </main>
    </div>
  );
};
