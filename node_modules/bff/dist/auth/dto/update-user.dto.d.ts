import { RegisterDto } from './register.dto';
declare const UpdateUserDto_base: import("@nestjs/common").Type<Partial<RegisterDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    password?: string;
    email?: string;
}
export {};
