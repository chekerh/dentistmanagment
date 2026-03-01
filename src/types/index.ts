export type UserRole = 'admin' | 'patient';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  bloodType?: string;
  allergies: string[];
  medicalHistory: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
  registeredDate: string;
  lastVisit?: string;
  nextAppointment?: string;
  status: 'active' | 'inactive';
  balance: number;
  avatar?: string;
}

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'checked-in' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type TreatmentType = 'checkup' | 'cleaning' | 'filling' | 'root-canal' | 'extraction' | 'crown' | 'whitening' | 'orthodontics' | 'implant' | 'other';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  duration: number; // minutes
  treatmentType: TreatmentType;
  room: string;
  dentist: string;
  status: AppointmentStatus;
  notes?: string;
  fee: number;
}

export interface Treatment {
  id: string;
  patientId: string;
  appointmentId: string;
  date: string;
  type: TreatmentType;
  description: string;
  toothNumbers?: number[];
  dentist: string;
  notes?: string;
  cost: number;
}

export type InventoryCategory = 'consumables' | 'equipment' | 'medications' | 'instruments' | 'protective' | 'other';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  sku: string;
  quantity: number;
  unit: string;
  reorderThreshold: number;
  unitCost: number;
  supplier: string;
  expirationDate?: string;
  lastRestocked: string;
  location: string;
  description?: string;
}

export type PaymentStatus = 'paid' | 'pending' | 'partial' | 'overdue' | 'cancelled';
export type PaymentMethod = 'cash' | 'card' | 'insurance' | 'bank-transfer' | 'check';

export interface Payment {
  id: string;
  patientId: string;
  patientName: string;
  appointmentId?: string;
  amount: number;
  paidAmount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  date: string;
  description: string;
  insuranceClaim?: string;
}

export interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'inventory' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}
