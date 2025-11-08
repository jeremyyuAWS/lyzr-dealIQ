import { ReactNode, useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isComplete?: boolean;
}

export default function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
  isComplete = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon && <div className="text-gray-700">{icon}</div>}
          <h2 className="text-xl font-bold text-black">{title}</h2>
          {isComplete && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              Complete
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronDown className="h-5 w-5 stroke-gray-600" />
        ) : (
          <ChevronRight className="h-5 w-5 stroke-gray-600" />
        )}
      </button>
      {isOpen && <div className="px-6 pb-6 pt-2">{children}</div>}
    </div>
  );
}
