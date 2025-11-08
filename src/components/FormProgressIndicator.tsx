import { CheckCircle2, Circle } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  isComplete: boolean;
}

interface FormProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  onStepClick: (stepIndex: number) => void;
}

export default function FormProgressIndicator({ steps, currentStep, onStepClick }: FormProgressIndicatorProps) {
  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <button
                onClick={() => onStepClick(index)}
                className={`flex items-center gap-2 transition-all ${
                  index === currentStep
                    ? 'text-black font-semibold'
                    : step.isComplete
                    ? 'text-green-600 hover:text-green-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {step.isComplete ? (
                  <CheckCircle2 className="h-5 w-5 stroke-green-600" />
                ) : (
                  <Circle
                    className={`h-5 w-5 ${
                      index === currentStep ? 'fill-black stroke-black' : 'stroke-current'
                    }`}
                  />
                )}
                <span className="text-sm hidden sm:inline">{step.label}</span>
              </button>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step.isComplete ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
