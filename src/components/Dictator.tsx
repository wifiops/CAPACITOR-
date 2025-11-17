import { useState, useEffect } from 'react'
import { useSpeechRecognition } from '../hooks/useSpeechRecognition'

export default function Dictator() {
  const [wordCount, setWordCount] = useState(0)
  const [manualText, setManualText] = useState('')
  
  const { 
    startListening, 
    stopListening, 
    transcript: liveTranscript,
    finalTranscript: speechFinalTranscript,
    isListening,
    isSupported 
  } = useSpeechRecognition()

  const [finalTranscript, setFinalTranscript] = useState('')

  // Auto-save finalized speech to our final transcript
  useEffect(() => {
    if (speechFinalTranscript && speechFinalTranscript !== finalTranscript) {
      setFinalTranscript(speechFinalTranscript)
    }
  }, [speechFinalTranscript])

  useEffect(() => {
    const text = finalTranscript + (liveTranscript ? ' ' + liveTranscript : '') + (manualText ? ' ' + manualText : '')
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }, [finalTranscript, liveTranscript, manualText])

  const handleToggle = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const handleClear = () => {
    setFinalTranscript('')
    setManualText('')
    setWordCount(0)
  }

  const handleCopy = async () => {
    const text = finalTranscript + (liveTranscript ? ' ' + liveTranscript : '') + (manualText ? ' ' + manualText : '')
    try {
      await navigator.clipboard.writeText(text)
      alert('Copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleManualTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setManualText(e.target.value)
  }

  const fullText = finalTranscript + (liveTranscript ? ' ' + liveTranscript : '') + (manualText ? ' ' + manualText : '')

  if (!isSupported) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-lg p-8 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <h2 className="text-xl font-semibold text-red-800">Browser Not Supported</h2>
          </div>
          <p className="text-red-700">
            Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Voice Dictator</h1>
          <p className="text-gray-600">Speak naturally or type manually - your words will appear in real-time</p>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{wordCount}</div>
              <div className="text-sm text-gray-500">Words</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">
                {fullText.length}
              </div>
              <div className="text-sm text-gray-500">Characters</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isListening ? 'text-green-500 animate-pulse' : 'text-gray-400'}`}>
                {isListening ? '●' : '○'}
              </div>
              <div className="text-sm text-gray-500">
                {isListening ? 'Listening' : 'Idle'}
              </div>
            </div>
          </div>
        </div>

        {/* Main Dictation Card */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Your Text</h2>
            <div className="flex gap-2">
              {fullText && (
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-medium flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy
                </button>
              )}
              <button
                onClick={handleClear}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition text-sm font-medium"
              >
                Clear
              </button>
            </div>
          </div>
          
          <div className="min-h-[400px] max-h-[600px] overflow-y-auto p-4 bg-gray-50 rounded-lg border-2 border-gray-200">
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
              {finalTranscript && (
                <span>{finalTranscript}</span>
              )}
              {liveTranscript && (
                <span className="text-blue-600 italic">{liveTranscript}</span>
              )}
              {manualText && (
                <span className="text-purple-600">{manualText}</span>
              )}
              {!finalTranscript && !liveTranscript && !manualText && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 min-h-[350px]">
                  <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                  <p className="text-xl">Start speaking or type below</p>
                  <p className="text-sm mt-2">Your words will appear here as you speak or type</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Manual Text Input */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Type Manually</h2>
          <textarea
            value={manualText}
            onChange={handleManualTextChange}
            placeholder="Type your text here..."
            className="w-full min-h-[120px] p-4 bg-gray-50 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none text-lg resize-y"
          />
        </div>

        {/* Control Button */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <button
            onClick={handleToggle}
            disabled={!isSupported}
            className={`w-full py-6 rounded-xl font-semibold text-lg transition-all transform ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg scale-105'
                : 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:scale-105'
            } ${!isSupported ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isListening ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-4 h-4 bg-white rounded-full animate-pulse"></span>
                <span>Listening... Click to Stop</span>
                <span className="w-4 h-4 bg-white rounded-full animate-pulse"></span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-3">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>Start Dictation</span>
              </span>
            )}
          </button>
          {isListening && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Note: Speech recognition requires internet connection. If you see network errors, try typing manually instead.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
