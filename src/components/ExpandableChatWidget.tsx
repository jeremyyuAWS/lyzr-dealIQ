import { useState, useEffect } from 'react';
import { MessageSquare, Maximize2, Minimize2, X } from 'lucide-react';
import ChatInterface from './ChatInterface';

interface ExpandableChatWidgetProps {
  onDataUpdate?: (data: any) => void;
  isVisible: boolean;
  onToggle: () => void;
}

type ViewMode = 'compact' | 'fullscreen';

export default function ExpandableChatWidget({ onDataUpdate, isVisible, onToggle }: ExpandableChatWidgetProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('compact');

  useEffect(() => {
    if (!isVisible) {
      setViewMode('compact');
    }
  }, [isVisible]);

  const handleMinimize = () => {
    onToggle();
  };

  const handleFullscreen = () => {
    setViewMode(viewMode === 'fullscreen' ? 'compact' : 'fullscreen');
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all flex items-center justify-center z-50 hover:scale-110"
        aria-label="Open chat assistant"
      >
        <MessageSquare className="h-6 w-6" />
      </button>
    );
  }

  const getWidgetStyles = () => {
    switch (viewMode) {
      case 'compact':
        return 'fixed bottom-6 right-6 w-96 h-[500px] rounded-2xl shadow-2xl';
      case 'fullscreen':
        return 'fixed inset-4 rounded-2xl shadow-2xl';
      default:
        return 'fixed bottom-6 right-6 w-96 h-[500px] rounded-2xl shadow-2xl';
    }
  };

  return (
    <div className={`${getWidgetStyles()} bg-white border border-gray-200 flex flex-col overflow-hidden z-50 transition-all duration-300`}>
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="text-white font-semibold text-sm">AI Deal Assistant</h3>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleFullscreen}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label={viewMode === 'fullscreen' ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {viewMode === 'fullscreen' ? (
              <Minimize2 className="h-4 w-4 stroke-white" />
            ) : (
              <Maximize2 className="h-4 w-4 stroke-white" />
            )}
          </button>
          <button
            onClick={handleMinimize}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X className="h-4 w-4 stroke-white" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <ChatInterface onDataUpdate={onDataUpdate} />
      </div>
    </div>
  );
}
