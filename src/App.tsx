import { useState } from 'react';
import EnhancedDealIntakeForm from './components/EnhancedDealIntakeForm';
import ExpandableChatWidget from './components/ExpandableChatWidget';
import AdminView from './components/AdminView';
import { LayoutDashboard, UserCircle } from 'lucide-react';

type ViewMode = 'intake' | 'admin';

function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('intake');
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center gap-4">
              <img
                src="/lyzr-logo-cut.png"
                alt="Lyzr Logo"
                className="h-10 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-black">DealIQ</h1>
                <p className="text-sm text-gray-600 mt-1">Validate opportunities with precision before they hit the pipeline</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('intake')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'intake'
                    ? 'bg-white text-black shadow-sm font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <UserCircle className="h-4 w-4" />
                <span className="text-sm">Intake Form</span>
              </button>
              <button
                onClick={() => setViewMode('admin')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                  viewMode === 'admin'
                    ? 'bg-white text-black shadow-sm font-medium'
                    : 'text-gray-600 hover:text-black'
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                <span className="text-sm">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {viewMode === 'admin' ? (
          <AdminView />
        ) : (
          <>
            <div className="h-full overflow-y-auto">
              <EnhancedDealIntakeForm />
            </div>
            <ExpandableChatWidget
              isVisible={isChatOpen}
              onToggle={() => setIsChatOpen(!isChatOpen)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
