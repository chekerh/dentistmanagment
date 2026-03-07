import type { AIResponse } from './types';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

class GeminiService {
  private apiKey: string | null = null;
  private readonly API_ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  
  /**
   * Initialize Gemini API key from environment
   */
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || null;
  }

  /**
   * Process message using Gemini AI
   */
  async processMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'bot'; content: string }> = []
  ): Promise<AIResponse> {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured. Add VITE_GEMINI_API_KEY to .env file');
    }

    try {
      const systemPrompt = this.buildSystemPrompt();
      const messages = this.formatConversationHistory(conversationHistory, userMessage);

      const response = await fetch(`${this.API_ENDPOINT}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: systemPrompt }],
            },
            ...messages,
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiText = data.candidates[0]?.content?.parts[0]?.text || '';

      // Parse Gemini's response into structured format
      return this.parseGeminiResponse(aiText);
    } catch (error) {
      console.error('Gemini service error:', error);
      throw error;
    }
  }

  /**
   * Build system prompt with context about DentoFlow
   */
  private buildSystemPrompt(): string {
    return `You are an AI assistant for DentoFlow, a dental practice management system.

Your capabilities:
1. Schedule/manage appointments
2. Add/update patient records
3. Check inventory status
4. Answer questions about the system
5. Provide dental practice insights

When responding, always:
- Be professional but friendly
- Extract structured data from user requests
- Ask clarifying questions if information is missing
- Provide actionable suggestions

Response Format (IMPORTANT - respond in this JSON format):
{
  "intent": {
    "action": "create|read|update|delete|query|help",
    "entity": "appointment|patient|inventory|invoice|general",
    "params": { /* extracted parameters */ }
  },
  "message": "Your natural language response to the user",
  "suggestions": ["suggestion1", "suggestion2"],
  "requiresConfirmation": true/false
}

Example user: "Schedule John Doe for cleaning tomorrow at 2pm"
Your response:
{
  "intent": {
    "action": "create",
    "entity": "appointment",
    "params": {
      "patientName": "John Doe",
      "treatment": "cleaning",
      "date": "tomorrow",
      "time": "14:00"
    }
  },
  "message": "I'll schedule John Doe for a dental cleaning tomorrow at 2:00 PM. Which doctor would you like to book with?",
  "suggestions": ["Dr. Smith", "Dr. Johnson", "Dr. Williams"],
  "requiresConfirmation": true
}

Current context: You are helping a dental clinic staff member or administrator. They have access to patient records, scheduling, and inventory management.`;
  }

  /**
   * Format conversation history for Gemini
   */
  private formatConversationHistory(
    history: Array<{ role: 'user' | 'bot'; content: string }>,
    currentMessage: string
  ): GeminiMessage[] {
    const messages: GeminiMessage[] = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    messages.push({
      role: 'user',
      parts: [{ text: currentMessage }],
    });

    return messages;
  }

  /**
   * Parse Gemini's response into structured AIResponse
   */
  private parseGeminiResponse(text: string): AIResponse {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // Validate structure
        if (parsed.intent && parsed.message) {
          return {
            intent: {
              ...parsed.intent,
              confidence: 0.95, // Gemini responses are high confidence
              source: 'cloud' as const,
            },
            message: parsed.message,
            suggestions: parsed.suggestions || [],
            requiresConfirmation: parsed.requiresConfirmation ?? true,
          };
        }
      }

      // Fallback: treat entire response as message
      return {
        intent: {
          action: 'help',
          entity: 'general',
          params: {},
          confidence: 0.7,
          source: 'cloud',
        },
        message: text,
        suggestions: [],
        requiresConfirmation: false,
      };
    } catch (error) {
      console.error('Failed to parse Gemini response:', error);
      
      return {
        intent: {
          action: 'help',
          entity: 'general',
          params: {},
          confidence: 0.5,
          source: 'cloud',
        },
        message: text,
        suggestions: [],
        requiresConfirmation: false,
      };
    }
  }

  /**
   * Check if Gemini is available
   */
  isAvailable(): boolean {
    return this.apiKey !== null;
  }

  /**
   * Set API key programmatically
   */
  setApiKey(key: string) {
    this.apiKey = key;
  }
}

export const geminiService = new GeminiService();
