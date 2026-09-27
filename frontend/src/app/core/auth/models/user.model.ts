export interface User {
  id: number;
  discord_id?: string | null;
  google_id?: string | null;
  name: string;
  email: string;
  role?: 'student' | 'admin';
  avatar: string | null;
  created_at?: string;
}

export interface UserResponse {
  status: string;
  data: User;
}

export interface AuthLoginResponse {
  status: string;
  token: string;
  user: User;
  note?: string;
}

export interface DiscordRedirectResponse {
  status: string;
  url: string;
  mock: boolean;
}

export interface GoogleRedirectResponse {
  status: string;
  url: string;
  mock: boolean;
}

