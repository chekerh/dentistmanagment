import type { Intent, AIResponse } from './types';
import { nlpService } from './nlpService';
import { geminiService } from './geminiService';

export type { Intent, AIResponse };

class AIService {
  private readonly CONFIDENCE_THRESHOLD = 0.7;
  private useLocalFirst = true;
  private geminiEnabled = true;

  /**
   * Process user input using hybrid AI approach:
   * 1. Try local NLP first (fast, free, private)
   * 2. If confidence < threshold, fallback to Gemini (accurate)
   */
  async processMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'bot'; content: string }> = []
  ): Promise<AIResponse> {
    try {
      // Step 1: Try local NLP first
      if (this.useLocalFirst) {
        const localResult = await nlpService.parseIntent(userMessage);
        
        if (localResult.confidence >= this.CONFIDENCE_THRESHOLD) {
          console.log('✅ Local AI handled request', localResult);
          return {
            intent: { ...localResult, source: 'local' },
            message: this.generateResponseMessage(localResult),
            suggestions: this.generateSuggestions(localResult),
            requiresConfirmation: this.requiresConfirmation(localResult),
          };
        }

        console.log('⚠️ Local confidence too low, trying Gemini fallback...');
      }

      // Step 2: Fallback to Gemini
      if (this.geminiEnabled) {
        const geminiResult = await geminiService.processMessage(userMessage, conversationHistory);
        console.log('🌐 Gemini AI handled request', geminiResult);
        return {
          ...geminiResult,
          intent: { ...geminiResult.intent, source: 'cloud' },
        };
      }

      // Step 3: If both fail, return default help response
      return this.getDefaultResponse();
    } catch (error) {
      console.error('AI Service Error:', error);
      return this.getErrorResponse();
    }
  }

  /**
   * Generate natural language response based on intent
   */
  private generateResponseMessage(intent: Intent): string {
    const { action, entity, params } = intent;

    // Create appointment responses
    if (action === 'create' && entity === 'appointment') {
      if (!params.patientName) {
        return 'Great! Who is the appointment for?';
      }
      if (!params.treatment) {
        return `Perfect! What type of treatment does ${params.patientName} need?`;
      }
      if (!params.time) {
        return 'What time would you like to schedule the appointment?';
      }
      if (!params.doctor) {
        return 'Which doctor should I schedule with?';
      }
      return `I'll schedule ${params.patientName} for ${params.treatment} on ${params.date} at ${params.time} with ${params.doctor}.`;
    }

    // Query responses
    if (action === 'query' && entity === 'appointment') {
      return `Let me check the appointments for you...`;
    }

    if (action === 'query' && entity === 'patient') {
      return `Looking up patient information...`;
    }

    if (action === 'query' && entity === 'inventory') {
      return `Checking inventory status...`;
    }

    // Create patient
    if (action === 'create' && entity === 'patient') {
      return `I'll help you add a new patient. What's their full name?`;
    }

    // Help requests
    if (action === 'help') {
      return `I can help you with:
- Scheduling appointments
- Adding/updating patient records
- Checking inventory
- Managing invoices
- Answering questions about the system

What would you like to do?`;
    }

    return 'I understand you need help with that. Could you provide more details?';
  }

  /**
   * Generate contextual suggestions
   */
  private generateSuggestions(intent: Intent): string[] {
    const { action, entity } = intent;

    if (action === 'create' && entity === 'appointment') {
      return ['View schedule', 'Add another appointment', 'Send reminder'];
    }

    if (action === 'query' && entity === 'appointment') {
      return ['Today\'s schedule', 'Tomorrow\'s schedule', 'This week'];
    }

    if (entity === 'patient') {
      return ['View patient details', 'Schedule appointment', 'Medical history'];
    }

    if (entity === 'inventory') {
      return ['Check stock levels', 'Reorder items', 'View suppliers'];
    }

    return ['Schedule appointment', 'Add patient', 'Check inventory'];
  }

  /**
   * Determine if action requires user confirmation
   */
  private requiresConfirmation(intent: Intent): boolean {
    const { action } = intent;
    // All create, update, delete actions require confirmation
    return ['create', 'update', 'delete'].includes(action);
  }

  /**
   * Default response when AI can't understand
   */
  private getDefaultResponse(): AIResponse {
    return {
      intent: {
        action: 'help',
        entity: 'general',
        params: {},
        confidence: 0,
        source: 'local',
      },
      message: "I'm not sure I understood that. I can help you with scheduling appointments, managing patients, checking inventory, and more. What would you like to do?",
      suggestions: ['Schedule Appointment', 'Add Patient', 'Check Inventory', 'Help'],
      requiresConfirmation: false,
    };
  }

  /**
   * Error response
   */
  private getErrorResponse(): AIResponse {
    return {
      intent: {
        action: 'help',
        entity: 'general',
        params: {},
        confidence: 0,
        source: 'local',
      },
      message: "I'm having trouble processing that right now. Please try again or rephrase your request.",
      suggestions: ['Try again', 'Help', 'Contact support'],
      requiresConfirmation: false,
    };
  }

  /**
   * Configure AI service
   */
  configure(config: { useLocalFirst?: boolean; geminiEnabled?: boolean }) {
    if (config.useLocalFirst !== undefined) {
      this.useLocalFirst = config.useLocalFirst;
    }
    if (config.geminiEnabled !== undefined) {
      this.geminiEnabled = config.geminiEnabled;
    }
  }

  /**
   * Get current configuration
   */
  getConfig() {
    return {
      useLocalFirst: this.useLocalFirst,
      geminiEnabled: this.geminiEnabled,
      confidenceThreshold: this.CONFIDENCE_THRESHOLD,
    };
  }
}

export const aiService = new AIService();
