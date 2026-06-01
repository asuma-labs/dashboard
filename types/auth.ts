export interface User {
  id: number | string;
  username: string;
  phone_number: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  username: string;
  password?: string; // Optional if you only support certain register params
  phone_number: string;
}
