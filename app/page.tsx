'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import DictationCard from '@/components/DictationCard';
import AICard from '@/components/AICard';
import TextEditor from '@/components/TextEditor';
import CommandsCard from '@/components/CommandsCard';
import CapacitorPanel from '@/components/CapacitorPanel';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

export default function Home() {
  const {
    isListening,
    finalTranscript,
    interimTranscript,
    status,
    startListening,
    stopListening,
    clearTranscript,
    setStatus,
  } = useSpeechRecognition();

  const [text, setText] = useState('');
  const [selectedText, setSelectedText] = useState('');
  const lastFinalTranscriptRef = useRef('');

  // Update text when transcript changes (only final transcript, no interim to avoid flickering)
  useEffect(() => {
    // Only update if finalTranscript actually changed (not from manual edits)
    if (finalTranscript !== lastFinalTranscriptRef.current) {
      setText(finalTranscript);
      lastFinalTranscriptRef.current = finalTranscript;
    }
  }, [finalTranscript]);

  const wordCount = useMemo(() => {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).filter(word => word.length > 0).length : 0;
  }, [text]);

  const handleTextChange = (newText: string) => {
    setText(newText);
  };

  const handleSelectionChange = (selected: string) => {
    setSelectedText(selected);
  };

  const handleApplySuggestion = (newText: string) => {
    // Replace selected text with suggestion
    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = text.substring(0, start);
      const after = text.substring(end);
      setText(before + newText + after);
      // Update cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + newText.length, start + newText.length);
      }, 0);
    }
    setSelectedText('');
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 bg-gray-100 min-h-screen p-8">
        <Header />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
          <DictationCard
            isListening={isListening}
            status={status}
            wordCount={wordCount}
            onStart={startListening}
            onStop={stopListening}
          />
          <AICard
            onCommand={() => setStatus('AI command mode - coming soon')}
            onGrammar={() => setStatus('Checking grammar...')}
            onImprove={() => setStatus('Improving text...')}
            onRead={() => {
              if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                speechSynthesis.speak(utterance);
                setStatus('Reading text aloud...');
              }
            }}
          />
          <TextEditor
            value={text}
            onChange={handleTextChange}
            onSelectionChange={handleSelectionChange}
          />
          <CommandsCard />
        </div>
        {selectedText && (
          <CapacitorPanel
            selectedText={selectedText}
            onApply={handleApplySuggestion}
            onClose={() => setSelectedText('')}
          />
        )}
      </main>
    </div>
  );
}
