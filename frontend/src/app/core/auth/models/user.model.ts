export interface User {
  id: number;
  discord_id: string;
  name: string;
  email: string;
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
