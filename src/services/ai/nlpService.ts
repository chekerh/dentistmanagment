import nlp from 'compromise';
// @ts-ignore - compromise plugins don't have proper types
import compromiseDates from 'compromise-dates';
// @ts-ignore - compromise plugins don't have proper types
import compromiseNumbers from 'compromise-numbers';
import type { Intent } from './types';

// Extend compromise with plugins
nlp.extend(compromiseDates);
nlp.extend(compromiseNumbers);

interface PatternMatch {
  regex: RegExp;
  handler: (match: RegExpMatchArray, doc: any) => Partial<Intent>;
}

class NLPService {
  private patterns: PatternMatch[] = [
    // Schedule appointment patterns
    {
      regex: /schedule|book|appointment|rendez-vous|planifier|موعد|جدولة/i,
      handler: (_, doc) => this.handleScheduleAppointment(doc),
    },
    // Add patient patterns
    {
      regex: /add|create|new.*patient|nouveau.*patient|مريض.*جديد/i,
      handler: (_, doc) => this.handleAddPatient(doc),
    },
    // Query appointments
    {
      regex: /show|list|view|display.*appointment|afficher.*rendez-vous|عرض.*موعد/i,
      handler: (_, doc) => this.handleQueryAppointments(doc),
    },
    // Query patient
    {
      regex: /patient|dossier|ملف.*مريض/i,
      handler: (_, doc) => this.handleQueryPatient(doc),
    },
    // Inventory check
    {
      regex: /stock|inventory|inventaire|مخزون|جرد/i,
      handler: (_, doc) => this.handleInventoryQuery(doc),
    },
    // Help request
    {
      regex: /help|aide|مساعدة|how to|comment/i,
      handler: () => ({ action: 'help', entity: 'general', confidence: 0.9 }),
    },
  ];

  /**
   * Parse user intent using local NLP (compromise.js)
   */
  async parseIntent(text: string): Promise<Intent> {
    const doc = nlp(text);
    const lowerText = text.toLowerCase();

    // Try pattern matching first
    for (const pattern of this.patterns) {
      const match = lowerText.match(pattern.regex);
      if (match) {
        const result = pattern.handler(match, doc);
        return {
          action: result.action || 'query',
          entity: result.entity || 'general',
          params: result.params || {},
          confidence: result.confidence || 0.8,
          source: 'local',
        };
      }
    }

    // No pattern matched - return low confidence
    return {
      action: 'help',
      entity: 'general',
      params: {},
      confidence: 0.3,
      source: 'local',
    };
  }

  /**
   * Handle schedule appointment intent
   */
  private handleScheduleAppointment(doc: any): Partial<Intent> {
    const params: Record<string, any> = {};

    // Extract person names (potential patient)
    const people = doc.people().out('array');
    if (people.length > 0) {
      params.patientName = people[0];
    }

    // Extract dates
    const dates = doc.dates().json();
    if (dates.length > 0) {
      params.date = dates[0].text;
    }

    // Extract times
    const timeMatch = doc.text().match(/(\d{1,2}):?(\d{2})?\s*(am|pm)?/i);
    if (timeMatch) {
      params.time = timeMatch[0];
    }

    // Extract treatment keywords
    const treatmentKeywords = {
      'cleaning': ['cleaning', 'nettoyage', 'تنظيف'],
      'checkup': ['checkup', 'check-up', 'contrôle', 'فحص'],
      'filling': ['filling', 'plombage', 'حشو'],
      'root canal': ['root canal', 'canal', 'علاج جذور'],
      'extraction': ['extraction', 'pull', 'خلع'],
      'crown': ['crown', 'couronne', 'تاج'],
      'whitening': ['whitening', 'blanchiment', 'تبييض'],
    };

    const text = doc.text().toLowerCase();
    for (const [treatment, keywords] of Object.entries(treatmentKeywords)) {
      if (keywords.some(kw => text.includes(kw))) {
        params.treatment = treatment;
        break;
      }
    }

    // Calculate confidence based on extracted params
    let confidence = 0.6; // Base confidence for matching "schedule" keyword
    if (params.patientName) confidence += 0.15;
    if (params.treatment) confidence += 0.15;
    if (params.date || params.time) confidence += 0.1;

    return {
      action: 'create',
      entity: 'appointment',
      params,
      confidence: Math.min(confidence, 1.0),
    };
  }

  /**
   * Handle add patient intent
   */
  private handleAddPatient(doc: any): Partial<Intent> {
    const params: Record<string, any> = {};

    // Extract person name
    const people = doc.people().out('array');
    if (people.length > 0) {
      params.name = people[0];
    }

    // Extract age
    const numbers = doc.numbers().out('array');
    if (numbers.length > 0) {
      params.age = parseInt(numbers[0]);
    }

    // Extract phone/email patterns
    const emailMatch = doc.text().match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) {
      params.email = emailMatch[0];
    }

    const phoneMatch = doc.text().match(/[\d\s()+-]{10,}/);
    if (phoneMatch) {
      params.phone = phoneMatch[0].replace(/\s/g, '');
    }

    const confidence = params.name ? 0.85 : 0.65;

    return {
      action: 'create',
      entity: 'patient',
      params,
      confidence,
    };
  }

  /**
   * Handle query appointments
   */
  private handleQueryAppointments(doc: any): Partial<Intent> {
    const params: Record<string, any> = {};
    const text = doc.text().toLowerCase();

    // Check for time references
    if (text.includes('today') || text.includes('aujourd\'hui') || text.includes('اليوم')) {
      params.timeframe = 'today';
    } else if (text.includes('tomorrow') || text.includes('demain') || text.includes('غدا')) {
      params.timeframe = 'tomorrow';
    } else if (text.includes('week') || text.includes('semaine') || text.includes('أسبوع')) {
      params.timeframe = 'week';
    } else if (text.includes('month') || text.includes('mois') || text.includes('شهر')) {
      params.timeframe = 'month';
    }

    // Extract patient name if mentioned
    const people = doc.people().out('array');
    if (people.length > 0) {
      params.patientName = people[0];
    }

    return {
      action: 'query',
      entity: 'appointment',
      params,
      confidence: 0.8,
    };
  }

  /**
   * Handle query patient
   */
  private handleQueryPatient(doc: any): Partial<Intent> {
    const params: Record<string, any> = {};

    // Extract patient name
    const people = doc.people().out('array');
    if (people.length > 0) {
      params.patientName = people[0];
    }

    // Check if asking for specific info
    const text = doc.text().toLowerCase();
    if (text.includes('history') || text.includes('historique') || text.includes('تاريخ')) {
      params.requestType = 'history';
    } else if (text.includes('contact') || text.includes('coordonnées') || text.includes('اتصال')) {
      params.requestType = 'contact';
    } else if (text.includes('appointment') || text.includes('rendez-vous') || text.includes('موعد')) {
      params.requestType = 'appointments';
    }

    const confidence = params.patientName ? 0.85 : 0.65;

    return {
      action: 'query',
      entity: 'patient',
      params,
      confidence,
    };
  }

  /**
   * Handle inventory query
   */
  private handleInventoryQuery(doc: any): Partial<Intent> {
    const params: Record<string, any> = {};
    const text = doc.text().toLowerCase();

    // Check for specific items
    const itemKeywords = [
      'gloves', 'gants', 'قفازات',
      'mask', 'masque', 'قناع',
      'anesthetic', 'anesthésique', 'مخدر',
      'composite', 'composite', 'حشو',
      'amalgam', 'amalgame', 'ملغم',
    ];

    for (const keyword of itemKeywords) {
      if (text.includes(keyword)) {
        params.item = keyword;
        break;
      }
    }

    // Check for low stock query
    if (text.includes('low') || text.includes('bas') || text.includes('منخفض')) {
      params.filter = 'low-stock';
    }

    return {
      action: 'query',
      entity: 'inventory',
      params,
      confidence: 0.8,
    };
  }
}

export const nlpService = new NLPService();
