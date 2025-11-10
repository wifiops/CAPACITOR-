/**
 * CAPACITOR AI Handler
 * Handles all AI-related operations for text improvement, rephrasing, etc.
 */

export class CapacitorAI {
  private apiUrl: string;

  constructor(apiUrl: string = 'http://localhost:8000/api') {
    this.apiUrl = apiUrl;
  }

  /**
   * Main AI API call function
   */
  async callAI(action: string, text: string): Promise<string> {
    // Call Next.js API route which proxies to FastAPI
    try {
      const response = await fetch('/api/ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action, text }),
      });

      if (!response.ok) {
        throw new Error('API error');
      }

      const data = await response.json();
      return data.result || text;
    } catch (error) {
      console.error('API call failed, using local fallback:', error);
      // Fallback to local processing
      await new Promise(resolve => setTimeout(resolve, 300));
      
      switch(action) {
        case 'improve':
          return this.localImprove(text);
        case 'rephrase':
          return this.localRephrase(text);
        case 'shorten':
          return this.localShorten(text);
        case 'formal':
          return this.localFormal(text);
        case 'friendly':
          return this.localFriendly(text);
        default:
          return this.localImprove(text);
      }
    }
  }

  localImprove(text: string): string {
    let improved = text.trim();
    
    if (improved.length > 0) {
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    }
    
    if (improved && !improved.match(/[.!?]$/)) {
      improved = improved + '.';
    }
    
    // Basic grammar fixes
    improved = improved.replace(/\bhit's\b/gi, 'his');
    improved = improved.replace(/\bthe thing is\b/gi, 'The truth is');
    improved = improved.replace(/\bin the surrounding\b/gi, 'around');
    improved = improved.replace(/\s+/g, ' ');
    
    return improved;
  }

  localRephrase(text: string): string {
    return text + ' (rephrased)';
  }

  localShorten(text: string): string {
    const words = text.split(' ');
    return words.slice(0, Math.ceil(words.length / 2)).join(' ');
  }

  localFormal(text: string): string {
    let formal = text.charAt(0).toUpperCase() + text.slice(1);
    if (!formal.match(/[.!?]$/)) {
      formal += '.';
    }
    return formal;
  }

  localFriendly(text: string): string {
    return text.replace(/\./g, '!');
  }

  setApiUrl(url: string): void {
    this.apiUrl = url;
  }
}

// Export as a singleton instance
export const capacitorAI = new CapacitorAI();

// Ensure it's available even if there's an initialization issue
if (typeof window !== 'undefined') {
  (window as any).capacitorAI = capacitorAI;
}

