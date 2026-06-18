// types/audio.ts
export interface AudioFromAPI {
  id: number;
  audio_id: string;
  title: string;
  text: string;
  duration: number;
  character_count: number;
  created_at: string;
  profile_id: number;
  waveform: string;
  profile_name: string;
  secondary_profile_name: string;
  waveform_url: string;
  audio_url: string;
}

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
