'use client';

import { useState, useEffect } from 'react';
import { capacitorAI } from '@/lib/ai';

interface CapacitorPanelProps {
  selectedText: string;
  onApply: (text: string) => void;
  onClose: () => void;
}

export default function CapacitorPanel({ selectedText, onApply, onClose }: CapacitorPanelProps) {
  const [loading, setLoading] = useState(false);
  const [suggestedText, setSuggestedText] = useState('');

  useEffect(() => {
    if (selectedText) {
      generateSuggestions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedText]);

  const generateSuggestions = async () => {
    setLoading(true);
    try {
      const improved = await capacitorAI.callAI('improve', selectedText);
      setSuggestedText(improved);
    } catch (error) {
      console.error('AI error:', error);
      setSuggestedText(capacitorAI.localImprove(selectedText));
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    setLoading(true);
    try {
      const processed = await capacitorAI.callAI(action, selectedText);
      onApply(processed);
      onClose();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedText) return null;

  return (
    <div className="fixed bottom-5 right-5 w-96 max-h-96 bg-white rounded-2xl shadow-2xl z-50 border-2 border-purple-500 animate-slide-in">
      <div className="flex justify-between items-center px-5 py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white">
        <div className="flex items-center gap-2 font-bold text-sm">
          <span className="text-lg animate-pulse">⚡</span>
          <span className="tracking-wide">CAPACITOR AI</span>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 border-none bg-white/20 text-white rounded-md text-xl cursor-pointer flex items-center justify-center transition-all hover:bg-white/30 hover:rotate-90 leading-none"
        >
          ×
        </button>
      </div>
      <div className="p-5 max-h-80 overflow-y-auto">
        {loading ? (
          <div className="flex items-center gap-3 p-4 text-gray-500 text-sm">
            <div className="w-5 h-5 border-2 border-gray-200 border-t-purple-500 rounded-full animate-spin"></div>
            <span>Analyzing with AI...</span>
          </div>
        ) : (
          <div className="mb-4">
            <div className="p-3.5 bg-blue-50 border-l-4 border-purple-500 rounded-lg text-sm leading-relaxed text-gray-900">
              {suggestedText || selectedText}
            </div>
          </div>
        )}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => onApply(suggestedText || selectedText)}
            className="px-5 py-2.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg text-sm font-semibold cursor-pointer transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
          >
            Apply
          </button>
          <div className="flex gap-2 flex-1 justify-end">
            {['improve', 'rephrase', 'shorten', 'formal', 'friendly'].map((action) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                className="w-9 h-9 border border-gray-200 bg-white rounded-lg text-lg cursor-pointer flex items-center justify-center transition-all hover:bg-gray-50 hover:border-purple-500 hover:-translate-y-0.5 hover:shadow-md"
                title={action.charAt(0).toUpperCase() + action.slice(1)}
              >
                {action === 'improve' && '✨'}
                {action === 'rephrase' && '🔄'}
                {action === 'shorten' && '✂️'}
                {action === 'formal' && '📝'}
                {action === 'friendly' && '😊'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

