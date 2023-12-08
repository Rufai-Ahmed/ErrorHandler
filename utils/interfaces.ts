import { HTTP } from "./enums";

export interface iError {
  name: string;
  message: string;
  status: HTTP;
  success: boolean;
}

export interface iUser {
  email: string;
  password: string;
  status: string;
  schoolCode: string;
  token: string;
  verify: boolean;
}

export interface iUserData extends iUser, Document {}
