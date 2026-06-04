import { UsersService } from './users.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<string | import("./entities/user.entity").User[]>;
    validateUser(validateUserDto: ValidateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
    }>;
    registerUser(registerUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        role: string;
        createdAt: Date;
    }>;
}
