export interface JwtPayload {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  role: number;
  token?: number;
}
