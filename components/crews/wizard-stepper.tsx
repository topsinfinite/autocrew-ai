import { Check } from 'lucide-react';

interface WizardStepperProps {
  currentStep: number;
  steps: {
    number: number;
    title: string;
  }[];
}

export function WizardStepper({ currentStep, steps }: WizardStepperProps) {
  return (
    <div className="w-full py-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.number} className="flex items-center flex-1">
              {/* Step Circle */}
              <div className="flex flex-col items-center">
                <div
                  className={`
                    relative flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all
                    ${isCompleted
                      ? 'bg-primary border-primary text-primary-foreground'
                      : isActive
                      ? 'bg-background border-primary text-primary'
                      : 'bg-background border-muted-foreground/30 text-muted-foreground'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-semibold">{step.number}</span>
                  )}
                </div>

                {/* Step Title */}
                <div className="mt-2 text-center">
                  <p
                    className={`text-sm font-medium ${
                      isActive ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {/* Connecting Line */}
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-4 -mt-12 transition-all ${
                    isCompleted ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
