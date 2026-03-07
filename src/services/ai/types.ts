export interface Intent {
  action: 'create' | 'read' | 'update' | 'delete' | 'query' | 'help';
  entity: 'patient' | 'appointment' | 'inventory' | 'invoice' | 'general';
  params: Record<string, any>;
  confidence: number;
  source: 'local' | 'cloud';
}

export interface AIResponse {
  intent: Intent;
  message: string;
  suggestions?: string[];
  requiresConfirmation: boolean;
}
