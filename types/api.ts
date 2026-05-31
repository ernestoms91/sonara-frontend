// types/api.ts

// Usuario
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

// Datos específicos de login
export interface LoginData {
  access_token: string;
  token_type: string;
  user: User;
}

// Respuesta base de la API
export interface ApiResponse<T = unknown> {
  ok: boolean;
  message: string;
  data: T;
  timestamp: string;
}

// Tipo específico para login
export type LoginResponse = ApiResponse<LoginData>;
