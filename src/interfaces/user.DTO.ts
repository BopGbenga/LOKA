export interface CreateUserDTO {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  isVerified: boolean;
  role: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
