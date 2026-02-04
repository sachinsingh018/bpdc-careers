interface ProgressStepsProps {
  steps: { label: string; description?: string }[];
  currentStep: number;
}

export function ProgressSteps({ steps, currentStep }: ProgressStepsProps) {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between text-sm font-medium text-neutral-900">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          return (
            <div key={step.label} className="flex flex-1 items-center">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm ${isActive
                    ? "border-neutral-900 bg-neutral-900 text-white"
                    : isCompleted
                      ? "border-neutral-900 bg-neutral-900/10 text-neutral-900"
                      : "border-neutral-200 bg-neutral-100 text-neutral-900"
                  }`}
              >
                {index + 1}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${isActive ? "text-neutral-900" : "text-neutral-900"}`}>
                  {step.label}
                </p>
                {step.description ? (
                  <p className="text-xs text-neutral-900">{step.description}</p>
                ) : null}
              </div>
              {index !== steps.length - 1 ? (
                <div className="mx-4 h-px flex-1 bg-neutral-200" aria-hidden />
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}

