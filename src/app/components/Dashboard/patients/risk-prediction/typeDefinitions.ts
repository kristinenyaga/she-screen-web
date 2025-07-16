export type Patient = {
  id: number;
  first_name: string;
  last_name: string;
  email?: string;
  date_of_birth: string;
};

export type PatientProfile = {
  id: number;
  patient_id: number;
  patient: Patient;
  number_of_sexual_partners?: number;
  first_sexual_intercourse_age?: number;
  smoking_status?: string;
  stds_history?: string;
  hpv_result?: string;
  [key: string]: string | number | Patient | undefined; // to allow dynamic keys
};

export type RiskAssessment = {
  age: number;
  [key: string]: unknown;
};

export type Prediction = {
  risk_probability: number;
  interpretation: string;
  screening_recommendations: {
    urgency: 'High' | 'Medium' | 'Low';
  };
};

export type AvailabilityItem = {
  service: string;
  available: boolean;
};

export type Summary = {
  risk_level: 'Low' | 'Medium' | 'High' | string;
  next_steps: string[];
  additional_services: string[];
  availability?: AvailabilityItem[];
  ai_recommendation?: string[];
};

export type RiskResult = {
  id: number;
  prediction: Prediction;
  summary: Summary;
  risk_assessment: RiskAssessment;
};

export type PricingDetails = {
  price: number;
  nhif_covered: boolean;
  nhif_amount: number;
};

export type RiskFormData = {
  first_name: string;
  last_name: string;
  phone_number: string;
  date_of_birth: string;
  area_of_residence: string;
  is_sexually_active: string;
  number_of_sexual_partners: string;
  first_sexual_intercourse_age: string;
  smoking_status: string;
  stds_history: string;
  hpv_result: string;
  immune_compromised: string;
  immune_condition_detail: string;
  contraceptive_using: string;
  contraceptive_use_years: string;
  hpv_vaccinated: string;
  has_children: string;
  children_count: string;
  first_pregnancy_age: string;
  family_history: string;
};

