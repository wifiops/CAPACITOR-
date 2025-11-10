'use client';

import { useState, useRef, useEffect } from 'react';

interface TextEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSelectionChange?: (selectedText: string) => void;
}

export default function TextEditor({ value, onChange, onSelectionChange }: TextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      if (textareaRef.current) {
        const start = textareaRef.current.selectionStart;
        const end = textareaRef.current.selectionEnd;
        const selected = value.substring(start, end);
        setSelectedText(selected);
        if (onSelectionChange) {
          onSelectionChange(selected);
        }
      }
    };

    const textarea = textareaRef.current;
    if (textarea) {
      textarea.addEventListener('mouseup', handleSelection);
      textarea.addEventListener('keyup', handleSelection);
      return () => {
        textarea.removeEventListener('mouseup', handleSelection);
        textarea.removeEventListener('keyup', handleSelection);
      };
    }
  }, [value, onSelectionChange]);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear all text?')) {
      onChange('');
    }
  };

  const handleCopy = async () => {
    if (!value.trim()) {
      return;
    }
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5 col-span-2">
      <div className="flex justify-between items-center p-5 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Your Text</h3>
        <div className="flex gap-2">
          <button
            onClick={handleClear}
            className="w-8 h-8 border-none bg-gray-100 rounded-md cursor-pointer text-base flex items-center justify-center transition-all hover:bg-gray-200"
          >
            🗑️
          </button>
          <button
            onClick={handleCopy}
            className="w-8 h-8 border-none bg-gray-100 rounded-md cursor-pointer text-base flex items-center justify-center transition-all hover:bg-gray-200"
          >
            📋
          </button>
        </div>
      </div>
      <div className="p-6">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Your transcribed text will appear here... Speak naturally and watch your words appear in real-time."
          className="w-full min-h-[400px] p-5 border-2 border-gray-200 rounded-xl text-base leading-relaxed font-sans resize-y transition-all focus:outline-none focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.1)] bg-white text-gray-900"
        />
      </div>
    </div>
  );
}

