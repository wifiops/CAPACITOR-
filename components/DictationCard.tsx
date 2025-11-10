'use client';

interface DictationCardProps {
  isListening: boolean;
  status: string;
  wordCount: number;
  onStart: () => void;
  onStop: () => void;
}

export default function DictationCard({ isListening, status, wordCount, onStart, onStop }: DictationCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Voice Dictation</h3>
        <span className="bg-green-500 text-white px-3 py-1 rounded-xl text-xs font-semibold">Active</span>
      </div>
      <div className="p-6">
        <div className="flex flex-col gap-4 mb-4">
          {!isListening ? (
            <button
              onClick={onStart}
              disabled={status.includes('Network error') && status.includes('wait')}
              className={`flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-base font-semibold transition-all shadow-md ${
                status.includes('Network error') && status.includes('wait')
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:shadow-lg hover:-translate-y-0.5'
              }`}
            >
              <span className="text-xl">🎤</span>
              <span>Start Dictation</span>
            </button>
          ) : (
            <>
              <button
                onClick={onStop}
                className="flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg text-base font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              >
                <span className="text-xl">⏹️</span>
                <span>Stop Dictation</span>
              </button>
              <div className="flex items-center gap-2 px-4 py-3 bg-blue-50 border-2 border-blue-600 rounded-lg text-blue-600 font-semibold text-sm">
                <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
                <span>Listening...</span>
              </div>
            </>
          )}
        </div>
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 text-sm">
          <span className="text-gray-500">{status}</span>
          <span className="text-blue-600 font-semibold">{wordCount} word{wordCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
}

