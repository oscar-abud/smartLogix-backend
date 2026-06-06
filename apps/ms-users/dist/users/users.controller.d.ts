import { UsersService } from './users.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    validateUser(validateUserDto: ValidateUserDto): Promise<{
        id: string;
        email: string;
        id_role: number;
        rol: string;
    }>;
    registerUser(registerUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        id_role: number;
        rol: string;
        createdAt: Date;
    }>;
}
