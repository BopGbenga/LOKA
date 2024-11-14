export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  role: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
