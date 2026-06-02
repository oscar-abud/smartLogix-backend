import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            email: any;
            role: string;
        };
    }>;
}
