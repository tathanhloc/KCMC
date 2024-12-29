export type UserRole = 'super_admin' | 'admin' | 'leader';

export interface User {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    fullName: string;
    avatar?: string;
} 