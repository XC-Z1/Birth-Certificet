export interface BirthRegistrationRecord {
  status?: number;
  success: boolean;
  message?: string;
  nameBangla?: string;
  nameEnglish?: string;
  brn?: string;
  dateOfBirth?: string;
  dateOfBirthEn?: string;
  fatherName?: string;
  fatherNameEn?: string;
  fathersNationality?: string;
  fathersNationalityEn?: string;
  motherName?: string;
  motherNameEn?: string;
  mothersNationality?: string;
  mothersNationalityEn?: string;
  gender?: string;
  genderEn?: string;
  birthPlace?: string;
  birthPlaceEn?: string;
  issuanceDate?: string;
  registerDate?: string;
  registerOfficeEn?: string;
  registerOfficeLocationEn?: string;
  responseTime?: string;
  verifiedAt?: string;
}

export interface SearchHistoryItem {
  id: string;
  brn: string;
  dob: string;
  timestamp: number;
  nameBangla?: string;
  nameEnglish?: string;
  record?: BirthRegistrationRecord;
  isFavorite?: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
}

export type BirthRecordResponse = BirthRegistrationRecord;

export type ViewMode = 'grid' | 'certificate';
export type ThemeMode = 'light' | 'dark' | 'auto';
