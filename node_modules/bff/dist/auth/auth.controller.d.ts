import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            email: any;
            role: any;
        };
    }>;
    register(registerDto: any): Promise<any>;
    getAll(): Promise<any>;
    findUser(id: string): Promise<any>;
}
