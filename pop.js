

class Dictator {
    constructor() {
        this.recognition = null;
        this.isListening = false;
        this.finalTranscript = '';
        this.interimTranscript = '';
        
        this.initializeElements();
        this.initializeSpeechRecognition();
        this.attachEventListeners();
    }

    initializeElements() {
        this.startBtn = document.getElementById('startDictationBtn');
        this.stopBtn = document.getElementById('stopDictationBtn');
        this.listeningIndicator = document.getElementById('listeningIndicator');
        this.textEditor = document.getElementById('textEditor');
        this.statusText = document.getElementById('statusText');
        this.wordCount = document.getElementById('wordCount');
        this.clearBtn = document.getElementById('clearBtn');
        this.copyBtn = document.getElementById('copyBtn');
    }

    initializeSpeechRecognition() {
        // Check if browser supports Web Speech API
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            this.showError('Your browser does not support speech recognition. Please use Chrome, Edge, or Safari.');
            return;
        }

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        this.recognition = new SpeechRecognition();
        
        // Configuration
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            this.updateUI(true);
            this.updateStatus('Listening... Speak naturally.');
        };

        this.recognition.onresult = (event) => {
            this.interimTranscript = '';
            
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const transcript = event.results[i][0].transcript;
                
                if (event.results[i].isFinal) {
                    this.finalTranscript += transcript + ' ';
                } else {
                    this.interimTranscript += transcript;
                }
            }

            this.updateTextEditor();
        };

        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            this.handleRecognitionError(event.error);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            this.updateUI(false);
            this.updateStatus('Dictation stopped. Click "Start Dictation" to continue.');
        };
    }

    attachEventListeners() {
        this.startBtn.addEventListener('click', () => this.startDictation());
        this.stopBtn.addEventListener('click', () => this.stopDictation());
        this.clearBtn.addEventListener('click', () => this.clearText());
        this.copyBtn.addEventListener('click', () => this.copyText());
        
        // Update word count as user types
        this.textEditor.addEventListener('input', () => this.updateWordCount());
    }

    startDictation() {
        if (!this.recognition) {
            this.showError('Speech recognition is not available in your browser.');
            return;
        }

        try {
            this.finalTranscript = this.textEditor.value || '';
            this.recognition.start();
        } catch (error) {
            console.error('Error starting recognition:', error);
            this.updateStatus('Error: Could not start dictation. Please try again.');
        }
    }

    stopDictation() {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
        }
    }

    updateTextEditor() {
        const fullText = this.finalTranscript + this.interimTranscript;
        this.textEditor.value = fullText;
        this.updateWordCount();
    }

    updateUI(isListening) {
        if (isListening) {
            this.startBtn.style.display = 'none';
            this.stopBtn.style.display = 'inline-flex';
            this.listeningIndicator.style.display = 'flex';
        } else {
            this.startBtn.style.display = 'inline-flex';
            this.stopBtn.style.display = 'none';
            this.listeningIndicator.style.display = 'none';
        }
    }

    updateStatus(message) {
        this.statusText.textContent = message;
    }

    updateWordCount() {
        const text = this.textEditor.value.trim();
        const words = text ? text.split(/\s+/).filter(word => word.length > 0) : [];
        this.wordCount.textContent = `${words.length} word${words.length !== 1 ? 's' : ''}`;
    }

    clearText() {
        if (confirm('Are you sure you want to clear all text?')) {
            this.textEditor.value = '';
            this.finalTranscript = '';
            this.interimTranscript = '';
            this.updateWordCount();
            this.updateStatus('Text cleared. Ready to dictate.');
        }
    }

    copyText() {
        const text = this.textEditor.value;
        if (!text.trim()) {
            this.updateStatus('No text to copy.');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            this.updateStatus('Text copied to clipboard!');
            setTimeout(() => {
                this.updateStatus('Ready to dictate');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy:', err);
            this.updateStatus('Failed to copy text.');
        });
    }

    handleRecognitionError(error) {
        let errorMessage = 'An error occurred. ';
        
        switch(error) {
            case 'no-speech':
                errorMessage += 'No speech detected. Please try again.';
                break;
            case 'audio-capture':
                errorMessage += 'No microphone found. Please check your microphone.';
                break;
            case 'not-allowed':
                errorMessage += 'Microphone permission denied. Please allow microphone access.';
                break;
            case 'network':
                errorMessage += 'Network error. Please check your connection.';
                break;
            default:
                errorMessage += `Error: ${error}`;
        }
        
        this.updateStatus(errorMessage);
        this.updateUI(false);
    }

    showError(message) {
        this.statusText.textContent = message;
        this.statusText.style.color = '#ef4444';
        this.startBtn.disabled = true;
    }
}

// Initialize Dictator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const dictator = new Dictator();
    console.log('Jarvis Dictator initialized');
});

