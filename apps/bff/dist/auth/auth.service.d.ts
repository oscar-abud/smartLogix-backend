import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class AuthService {
    private readonly jwtService;
    private readonly httpService;
    private readonly usersServiceUrl;
    constructor(jwtService: JwtService, httpService: HttpService);
    login(loginDto: any): Promise<{
        access_token: string;
        user: {
            email: any;
            role: any;
        };
    }>;
    register(registerDto: any): Promise<any>;
    getAll(): Promise<any>;
    getUser(id: string): Promise<any>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<any>;
    deleteUser(id: string): Promise<any>;
}
