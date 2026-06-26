// types/api.ts

// ============================================
// USUARIO
// ============================================
export interface User {
  id: number;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  access_token: string;
  token_type: string;
  user: User;
}

// ============================================
// AUDIO
// ============================================
export interface AudioFromAPI {
  id: number;
  audio_id: string;
  profile_id: number;
  secondary_profile_id: number | null;
  text: string;
  title: string;
  duration: number;
  waveform: string;
  created_by: string;
  created_at: string;
  active: boolean;
  character_count: number;
  profile_name?: string | null;
  secondary_profile_name?: string | null;
  waveform_url?: string | null;
  audio_url?: string | null;
}

// AudioListApiResponse (de types/audio.ts)
export interface AudioListApiResponse {
  ok: boolean;
  message: string;
  data: {
    items: AudioFromAPI[];
    total: number;
    page: number;
    size: number;
    pages: number;
  };
  timestamp: string;
}

// AudioItem (para UI)
export interface AudioItem {
  id: string;
  code: string;
  voice: string;
  voiceName: string;
  voiceName2: string;
  text: string;
  duration: string;
  timeAgo: string;
  audio_url?: string;
  waveform_url?: string;
}

// ============================================
// BOLETÍN
// ============================================
export interface BoletinFromAPI {
  id: number;
  start_time: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  audio_count: number;
  audio_ids: string[];
  audios?: AudioFromAPI[];
}

export interface BoletinListData {
  items: BoletinFromAPI[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface BoletinDetailData {
  id: number;
  start_time: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
  audio_count: number;
  audio_ids: string[];
  audios: AudioFromAPI[];
}

// ============================================
// RESPUESTAS BASE DE LA API
// ============================================
export interface ApiResponse<T = unknown> {
  ok: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// ============================================
// TIPOS PARA SERVER ACTIONS
// ============================================
export interface ActionResponse<T = unknown> {
  success: boolean;
  error?: string;
  data?: T;
}

// ============================================
// TIPOS ESPECÍFICOS PARA BOLETINES (Client)
// ============================================
export type BoletinListClientResponse = ActionResponse<BoletinListData>;
export type BoletinDetailClientResponse = ActionResponse<BoletinDetailData>;

// ============================================
// TIPOS PARA AUDIOS (Client)
// ============================================
export type AudioListClientResponse = ActionResponse<{
  items: AudioFromAPI[];
  total: number;
  page: number;
  size: number;
  pages: number;
}>;

// ============================================
// TIPOS ESPECÍFICOS PARA LOGIN
// ============================================
export type LoginResponse = ApiResponse<LoginData>;

// ============================================
// TIPOS PARA SOLICITUDES
// ============================================
export interface CreateBoletinRequest {
  start_time: string;
  audio_ids: string[];
}

export interface UpdateBoletinRequest {
  audio_ids: string[];
  start_time: string;
}
