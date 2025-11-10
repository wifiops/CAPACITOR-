'use client';

interface AICardProps {
  onCommand: () => void;
  onGrammar: () => void;
  onImprove: () => void;
  onRead: () => void;
}

export default function AICard({ onCommand, onGrammar, onImprove, onRead }: AICardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">AI Assistant</h3>
      </div>
      <div className="p-6">
        <button
          onClick={onCommand}
          className="flex items-center justify-center gap-2 px-6 py-3.5 w-full bg-gray-100 text-gray-900 border-2 border-gray-200 rounded-lg text-base font-semibold cursor-pointer transition-all hover:bg-gray-200 hover:border-gray-300 hover:-translate-y-0.5 mb-4"
        >
          <span className="text-xl">🤖</span>
          <span>Voice Command</span>
        </button>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={onGrammar}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5"
          >
            ✓ Grammar
          </button>
          <button
            onClick={onImprove}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5"
          >
            ✨ Improve
          </button>
          <button
            onClick={onRead}
            className="flex-1 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900 cursor-pointer transition-all hover:bg-gray-50 hover:border-gray-300 hover:-translate-y-0.5"
          >
            🔊 Read
          </button>
        </div>
      </div>
    </div>
  );
}

