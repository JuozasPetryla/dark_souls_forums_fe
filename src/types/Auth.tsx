export interface LoginResponse {
    success: string;
    access_token: string;
}

export interface AuthUser {
    id: string;
    email: string;
    role: string;
}

export interface RegistrationResponse {
    user: AuthUser;
    access_token: string;
    success: string
}
