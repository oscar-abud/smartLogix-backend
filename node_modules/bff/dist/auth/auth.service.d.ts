import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly httpService;
    private readonly usersServiceUrl;
    private readonly inventoryServiceUrl;
    constructor(jwtService: JwtService, httpService: HttpService);
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
    getUser(id: string): Promise<any>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    deleteUser(id: string): Promise<any>;
    unlinkUserFromInventory(inventoryId: number, userId: string): Promise<any>;
}
