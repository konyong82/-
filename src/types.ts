export interface QnAPost {
  id: string;
  title: string;
  content: string;
  category: "visa" | "penalty" | "job" | "other";
  authorName: string;
  contactInfo?: string;
  isPrivate: boolean;
  createdAt: string;
  answer?: {
    content: string;
    answeredAt: string;
    author: string;
  };
}

export interface SuccessCase {
  id: string;
  title: string;
  category: "visa" | "penalty" | "job";
  clientNationality: string;
  visaType: string;
  description: string;
  date: string;
  outcome: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: string;
}

export interface VisaProfile {
  nationality: string;
  education: string;
  topik: string;
  annualIncome: string;
  currentVisa: string;
  message?: string;
}
