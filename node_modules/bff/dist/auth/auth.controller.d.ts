import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            email: any;
            role: string;
        };
    }>;
    getProfile(req: any): {
        message: string;
        user: any;
    };
}
