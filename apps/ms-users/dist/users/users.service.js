"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
let UsersService = class UsersService {
    userRepository;
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async registerUser(registerDto) {
        const { email, password, roleId } = registerDto;
        const userExists = await this.userRepository.findOne({ where: { email } });
        if (userExists) {
            throw new common_1.BadRequestException('El correo ya está registrado');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = this.userRepository.create({
            email,
            password: hashedPassword,
            role: { id: roleId || 3 }
        });
        const userSaved = await this.userRepository.save(newUser);
        return {
            id: userSaved.id,
            email: userSaved.email,
            id_role: userSaved.role.id,
            rol: userSaved.role.name,
            createdAt: userSaved.createdAt
        };
    }
    async validateUserCredentials(validateUserDto) {
        const { email, password } = validateUserDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta o usuario inexistente');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Contraseña incorrecta o usuario inexistente');
        }
        return {
            id: user.id,
            email: user.email,
            id_role: user.role.id,
            rol: user.role.name,
        };
    }
    async findAll() {
        try {
            const users = await this.userRepository.find();
            console.log(users);
            return users;
        }
        catch (error) {
            return `Error interno del servidor ${error}`;
        }
    }
    async getUser(id) {
        try {
            const user = await this.userRepository.findOne({
                where: { id }
            });
            return user;
        }
        catch (error) {
            return `Error interno del servidor ${error}`;
        }
    }
    async updateUser(id, updateUserDto) {
        try {
            const userExists = await this.userRepository.findOne({
                where: { id }
            });
            if (!userExists) {
                throw new common_1.NotFoundException(`El usuario con ID ${id} no existe`);
            }
            if (updateUserDto.email === '')
                delete updateUserDto.email;
            if (updateUserDto.password === '')
                delete updateUserDto.password;
            if (updateUserDto.password) {
                const salt = await bcrypt.genSalt(10);
                updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
            }
            const userUpdated = Object.assign(userExists, updateUserDto);
            await this.userRepository.save(userUpdated);
            delete userUpdated.password;
            return userUpdated;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Error interno del servidor: ${error.message || error}`);
        }
    }
    async deleteUser(id) {
        try {
            const userExists = await this.userRepository.findOne({
                where: { id }
            });
            if (!userExists) {
                throw new common_1.NotFoundException(`El usuario con ID ${id} no existe`);
            }
            await this.userRepository.delete(id);
            return {
                message: 'Usuario eliminado con éxito',
                id
            };
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.InternalServerErrorException(`Error interno del servidor: ${error.message || error}`);
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map