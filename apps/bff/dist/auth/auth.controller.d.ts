import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: any;
            email: any;
            role: {
                id: any;
                name: any;
            };
            createdAt: any;
        };
    }>;
    register(registerDto: RegisterDto): Promise<any>;
    getAll(): Promise<any>;
    findUser(id: string): Promise<any>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    deleteUser(id: string): Promise<any>;
}
