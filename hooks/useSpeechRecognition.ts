'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { processPunctuationInText, isCommand } from '@/lib/punctuation';

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => any) | null;
  onend: ((this: SpeechRecognition, ev: Event) => any) | null;
}

declare var SpeechRecognition: {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
};

declare var webkitSpeechRecognition: {
  new (): SpeechRecognition;
  prototype: SpeechRecognition;
};

export function useSpeechRecognition() {
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [status, setStatus] = useState('Ready to dictate');
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isListeningRef = useRef(false);
  const statusRef = useRef('Ready to dictate');
  const lastErrorTimeRef = useRef(0);
  const errorCountRef = useRef(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setStatus('Speech recognition not supported in this browser');
        console.error('Speech recognition API not available');
        return;
      }

      console.log('Initializing speech recognition...');
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        isListeningRef.current = true;
        setIsListening(true);
        setStatus('Listening... Speak naturally.');
        statusRef.current = 'Listening... Speak naturally.';
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const isFinal = event.results[i].isFinal;
          
          if (isFinal) {
            // Check if it's a command first
            if (isCommand(transcript)) {
              // Handle command (will be processed by parent component)
              setStatus(`Command detected: "${transcript}"`);
              continue;
            }
            
            // Process punctuation commands in the transcript
            const processed = processPunctuationInText(transcript);
            final += processed + ' ';
          } else {
            // For interim results, just show in status (don't add to text)
            interim = processPunctuationInText(transcript);
            if (interim.trim()) {
              setStatus(`Listening: "${interim}"...`);
            }
          }
        }

        if (final) {
          setFinalTranscript((prev: string) => {
            const trimmed = prev.trimEnd();
            const processedFinal = final.trim();
            // Add space before if needed
            if (trimmed && !trimmed.match(/[,.;:!?\(\[\]"\n]$/) && !processedFinal.match(/^[,.;:!?\(\[\]"\n]/)) {
              return trimmed + ' ' + processedFinal;
            }
            return trimmed + processedFinal;
          });
        }
        
        // Only show interim in status, not in text editor
        setInterimTranscript('');
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        
        // Immediately stop and abort on any error
        isListeningRef.current = false;
        setIsListening(false);
        
        // Stop recognition completely to prevent retries
        try {
          if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current.abort();
          }
        } catch (e) {
          // Ignore errors from stop/abort
        }
        
        const now = Date.now();
        const timeSinceLastError = now - lastErrorTimeRef.current;
        
        // Handle specific error types
        switch (event.error) {
          case 'network':
            errorCountRef.current += 1;
            lastErrorTimeRef.current = now;
            
            // If multiple network errors in quick succession, provide more specific guidance
            if (errorCountRef.current > 2 && timeSinceLastError < 5000) {
              const networkMsg = 'Network error: Speech recognition requires internet. Check firewall/VPN settings or try a different network.';
              setStatus(networkMsg);
              statusRef.current = networkMsg;
            } else {
              const networkMsg = 'Network error: Check your internet connection. Speech recognition requires internet access.';
              setStatus(networkMsg);
              statusRef.current = networkMsg;
            }
            break;
          case 'not-allowed':
            const permissionMsg = 'Microphone permission denied. Please allow microphone access in your browser settings.';
            setStatus(permissionMsg);
            statusRef.current = permissionMsg;
            break;
          case 'no-speech':
            setStatus('No speech detected. Please speak clearly.');
            statusRef.current = 'No speech detected. Please speak clearly.';
            break;
          case 'aborted':
            setStatus('Dictation stopped.');
            statusRef.current = 'Dictation stopped.';
            break;
          case 'audio-capture':
            const micMsg = 'No microphone found. Please connect a microphone.';
            setStatus(micMsg);
            statusRef.current = micMsg;
            break;
          case 'service-not-allowed':
            const serviceMsg = 'Speech recognition service not allowed. Check browser settings.';
            setStatus(serviceMsg);
            statusRef.current = serviceMsg;
            break;
          default:
            const defaultMsg = `Error: ${event.error}. Please try again.`;
            setStatus(defaultMsg);
            statusRef.current = defaultMsg;
        }
      };

      recognition.onend = () => {
        // NEVER auto-restart - completely stop on end
        // This prevents the infinite retry loop on network errors
        isListeningRef.current = false;
        setIsListening(false);
        
        // Only update status if it's not already an error status
        const currentStatus = statusRef.current;
        const isError = currentStatus.includes('Error') || 
                       currentStatus.includes('Network') || 
                       currentStatus.includes('permission') ||
                       currentStatus.includes('denied') ||
                       currentStatus.includes('No microphone');
        
        if (!isError) {
          setStatus('Dictation stopped.');
          statusRef.current = 'Dictation stopped.';
        }
      };

      recognitionRef.current = recognition;
      console.log('Speech recognition initialized successfully');
      setStatus('Ready to dictate - Click Start Dictation');
      statusRef.current = 'Ready to dictate - Click Start Dictation';

      return () => {
        if (recognitionRef.current) {
          isListeningRef.current = false;
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        }
      };
    } catch (error: any) {
      console.error('Error initializing speech recognition:', error);
      setStatus(`Error: Could not initialize speech recognition - ${error.message || 'Unknown error'}`);
      recognitionRef.current = null;
    }
  }, []);

  const startListening = useCallback(() => {
    console.log('startListening called', { 
      hasRecognition: !!recognitionRef.current, 
      isListening 
    });
    
    if (!recognitionRef.current) {
      setStatus('Error: Speech recognition not initialized. Please refresh the page.');
      console.error('Recognition not initialized');
      return;
    }
    
    if (isListening) {
      console.log('Already listening');
      return;
    }
    
    // Check if we just had a network error - add cooldown
    const now = Date.now();
    const timeSinceLastError = now - lastErrorTimeRef.current;
    if (statusRef.current.includes('Network error') && timeSinceLastError < 3000) {
      setStatus('Please wait a moment before trying again...');
      return;
    }
    
    // Reset error count if enough time has passed
    if (timeSinceLastError > 10000) {
      errorCountRef.current = 0;
    }
    
    // Check internet connection first
    if (!navigator.onLine) {
      setStatus('No internet connection. Speech recognition requires internet access.');
      statusRef.current = 'No internet connection. Speech recognition requires internet access.';
      return;
    }
    
    // Additional check: Try to verify connectivity to Google
    // This is a lightweight check that doesn't block the UI
    fetch('https://www.google.com/favicon.ico', { 
      method: 'HEAD', 
      mode: 'no-cors',
      cache: 'no-cache'
    }).catch(() => {
      // If this fails, network is definitely down
      console.warn('Cannot reach Google servers - network may be blocked');
    });
    
    try {
      recognitionRef.current.start();
      console.log('Recognition started successfully');
      setStatus('Starting... Please allow microphone access if prompted.');
      statusRef.current = 'Starting... Please allow microphone access if prompted.';
    } catch (error: any) {
      console.error('Error starting recognition:', error);
      const errorMsg = error.message || 'Unknown error';
      
      if (errorMsg.includes('already started') || errorMsg.includes('aborted')) {
        // Try to restart
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
          setTimeout(() => {
            try {
              recognitionRef.current?.start();
              setStatus('Restarting... Please allow microphone access.');
            } catch (retryError) {
              setStatus('Error: Could not start dictation. Please try again.');
            }
          }, 100);
        } catch (restartError) {
          setStatus('Error: Could not start dictation. Please refresh the page.');
        }
      } else if (errorMsg.includes('not-allowed') || errorMsg.includes('permission')) {
        setStatus('Microphone permission denied. Please allow access in browser settings.');
      } else {
        setStatus(`Error: ${errorMsg}. Please check your internet connection.`);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      isListeningRef.current = false;
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }
  }, []);

  const clearTranscript = useCallback(() => {
    setFinalTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    finalTranscript,
    interimTranscript,
    status,
    startListening,
    stopListening,
    clearTranscript,
    setStatus,
  };
}

