import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    registerUser(registerDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
    validateUserCredentials(validateUserDto: ValidateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
}
