import { UsersService } from './users.service';
import { ValidateUserDto } from './dto/validate-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<string | import("./entities/user.entity").User[]>;
    findUser(id: string): Promise<string | import("./entities/user.entity").User>;
    validateUser(validateUserDto: ValidateUserDto): Promise<{
        id: string;
        email: string;
        role: {
            id: number;
            name: string;
        };
        createdAt: Date;
    }>;
    registerUser(registerUserDto: CreateUserDto): Promise<{
        id: string;
        email: string;
        id_role: number;
        rol: string;
        createdAt: Date;
    }>;
    updateUser(id: string, updateUserDto: UpdateUserDto): Promise<import("./entities/user.entity").User & UpdateUserDto>;
    deleteUser(id: string): Promise<{
        message: string;
        id: string;
    }>;
}
