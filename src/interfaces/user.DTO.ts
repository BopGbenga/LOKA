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

export interface CreateArtisanDTO {
  userId: number;
  businessName: string;
  businessCategory: string;
  businessLocation: string;
  businessDescription: string;
  contactInformation: string;
}

export interface LoginUserDTO {
  email: string;
  password: string;
}
