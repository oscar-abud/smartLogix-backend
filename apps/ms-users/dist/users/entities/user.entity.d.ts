import { Role } from './role.entity';
export declare class User {
    id: string;
    email: string;
    password: string;
    role: Role;
    createdAt: Date;
}
