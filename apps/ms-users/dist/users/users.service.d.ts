import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    registerUser(registerDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        id_role: number;
        rol: string;
        createdAt: Date;
    }>;
    validateUserCredentials(validateUserDto: ValidateUserDto): Promise<{
        id: string;
        email: string;
        role: {
            id: number;
            name: string;
        };
        createdAt: Date;
    }>;
    findAll(): Promise<string | User[]>;
    getUser(id: string): Promise<string | User>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User & UpdateUserDto>;
    deleteUser(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
