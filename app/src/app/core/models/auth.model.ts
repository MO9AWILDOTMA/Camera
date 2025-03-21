export interface LoginModel{
  email: string;
  password: string;
}

export interface RegisterModel {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  password?: string;
}
