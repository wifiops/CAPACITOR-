import { useState, useEffect, useRef } from 'react'

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  start(): void
  stop(): void
  abort(): void
  onresult: (event: SpeechRecognitionEvent) => void
  onerror: (event: SpeechRecognitionErrorEvent) => void
  onend: () => void
}

interface SpeechRecognitionEvent {
  resultIndex: number
  results: SpeechRecognitionResultList
}

interface SpeechRecognitionErrorEvent {
  error: string
  message: string
}

interface SpeechRecognitionResultList {
  length: number
  item(index: number): SpeechRecognitionResult
  [index: number]: SpeechRecognitionResult
}

interface SpeechRecognitionResult {
  length: number
  item(index: number): SpeechRecognitionAlternative
  [index: number]: SpeechRecognitionAlternative
  isFinal: boolean
}

interface SpeechRecognitionAlternative {
  transcript: string
  confidence: number
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition
    webkitSpeechRecognition: new () => SpeechRecognition
  }
}

export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isListeningRef = useRef(false)
  const finalTranscriptRef = useRef('')

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognition = new SpeechRecognition()
      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = 'en-US'

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = ''
        let newFinalTranscript = ''

        // Process all results from the beginning to get complete final transcript
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          if (result.isFinal) {
            newFinalTranscript += transcript + ' '
          } else {
            interimTranscript += transcript
          }
        }

        // Update final transcript if there's new finalized text
        if (newFinalTranscript !== finalTranscriptRef.current) {
          finalTranscriptRef.current = newFinalTranscript
          setFinalTranscript(newFinalTranscript)
        }

        // Set interim transcript for live preview
        setTranscript(interimTranscript)
      }

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error)
        if (event.error === 'network') {
          console.warn('Network error - speech recognition requires internet connection')
        }
        if (event.error !== 'no-speech' && event.error !== 'aborted') {
          setIsListening(false)
          isListeningRef.current = false
        }
      }

      recognition.onend = () => {
        if (isListeningRef.current) {
          // Auto-restart if it was listening (unless manually stopped)
          try {
            recognition.start()
          } catch (e) {
            setIsListening(false)
            isListeningRef.current = false
          }
        } else {
          setIsListening(false)
        }
      }

      recognitionRef.current = recognition
    } else {
      setIsSupported(false)
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop()
          recognitionRef.current.abort()
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    }
  }, [])

  const startListening = () => {
    if (recognitionRef.current && !isListeningRef.current) {
      try {
        finalTranscriptRef.current = ''
        setFinalTranscript('')
        setTranscript('')
        recognitionRef.current.start()
        setIsListening(true)
        isListeningRef.current = true
      } catch (error) {
        console.error('Error starting speech recognition:', error)
        setIsListening(false)
        isListeningRef.current = false
      }
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        isListeningRef.current = false
        recognitionRef.current.stop()
        setIsListening(false)
        // Save any remaining interim transcript as final
        if (transcript.trim()) {
          setFinalTranscript(prev => prev + (prev ? ' ' : '') + transcript.trim())
          setTranscript('')
        }
      } catch (error) {
        console.error('Error stopping speech recognition:', error)
        setIsListening(false)
        isListeningRef.current = false
      }
    }
  }

  return {
    transcript,
    finalTranscript,
    isListening,
    isSupported,
    startListening,
    stopListening,
  }
}
