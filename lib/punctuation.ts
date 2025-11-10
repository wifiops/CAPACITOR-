/**
 * Punctuation processing utilities
 */

export const punctuationMap: Record<string, string> = {
  'new paragraph': '\n\n',
  'new line': '\n',
  'question mark': '?',
  'exclamation mark': '!',
  'exclamation point': '!',
  'exclamation': '!',
  'full stop': '.',
  'open parenthesis': '(',
  'close parenthesis': ')',
  'open bracket': '[',
  'close bracket': ']',
  'quotation mark': '"',
  'comma': ',',
  'period': '.',
  'semicolon': ';',
  'colon': ':',
  'dash': '—',
  'hyphen': '-',
  'quote': '"'
};

export function processPunctuationInText(text: string): string {
  if (!text || !text.trim()) return text;
  
  const originalWords = text.trim().split(/\s+/);
  const normalizedText = text.toLowerCase().trim();
  const words = normalizedText.split(/\s+/).map(w => w.replace(/[.,!?;:]/g, '').trim()).filter(w => w.length > 0);
  const result: string[] = [];
  let i = 0;
  
  while (i < words.length) {
    let foundPunctuation = false;
    let matchedLength = 0;
    let matchedPunctuation = '';
    
    // Check for multi-word punctuation commands first (longest match first)
    for (let len = Math.min(3, words.length - i); len >= 1; len--) {
      const phrase = words.slice(i, i + len).join(' ').trim();
      
      if (punctuationMap.hasOwnProperty(phrase)) {
        matchedPunctuation = punctuationMap[phrase];
        matchedLength = len;
        foundPunctuation = true;
        break;
      }
    }
    
    if (foundPunctuation) {
      result.push(matchedPunctuation);
      i += matchedLength;
    } else {
      const originalIndex = Math.min(i, originalWords.length - 1);
      result.push(originalWords[originalIndex] || words[i]);
      i++;
    }
  }
  
  // Join and clean up spacing
  let finalText = result.join(' ');
  // Remove space before punctuation
  finalText = finalText.replace(/\s+([,.;:!?])/g, '$1');
  // Add space after punctuation (except at end and except for newlines)
  finalText = finalText.replace(/([,.;:!?])([^\s\n])/g, '$1 $2');
  // Handle newlines - remove surrounding spaces
  finalText = finalText.replace(/\s*\n\n\s*/g, '\n\n');
  finalText = finalText.replace(/\s*\n\s*/g, '\n');
  // Clean up multiple spaces but preserve single spaces
  finalText = finalText.replace(/[ \t]+/g, ' ');
  
  return finalText.trim();
}

export function isCommand(text: string): boolean {
  const commandKeywords = [
    'verify grammar', 'check grammar', 'fix grammar',
    'make it more formal', 'make it formal', 'make it casual',
    'read it back', 'read that', 'read this',
    'undo that', 'undo last', 'undo change',
    'make it shorter', 'make it longer', 'summarize',
    'improve this', 'rewrite', 'make it better',
  ];
  return commandKeywords.some(keyword => text.toLowerCase().includes(keyword));
}

