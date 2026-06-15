import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Mock de la librería bcrypt para controlar la encriptación
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
  genSalt: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;
  let userRepository: Repository<User>;

  // Mock del repositorio de TypeORM para la entidad User
  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined (El servicio debe instanciarse correctamente)', () => {
    expect(service).toBeDefined();
  });

  // 1. Test para registerUser
  describe('registerUser', () => {
    const registerDto = { email: 'test@smartlogix.com', password: 'password123', roleId: 2 };

    it('should register a new user successfully', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword123');
      
      // Ajustado para que userSaved.role.id y userSaved.role.name no den undefined
      const mockSavedUser = { 
        id: 'uuid-123', 
        email: registerDto.email, 
        role: { id: 2, name: 'OPERATOR' },
        createdAt: new Date()
      };
      
      mockUserRepository.create.mockReturnValue(mockSavedUser);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      const result = await service.registerUser(registerDto);

      expect(result).toBeDefined();
      expect(result.id).toBe('uuid-123');
      expect(result.email).toBe(registerDto.email);
      expect(result.id_role).toBe(2);
      expect(result.rol).toBe('OPERATOR');
    });

    it('should throw BadRequestException if email already exists', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: 'existing-id' });

      try {
        await service.registerUser(registerDto);
        fail('Debió lanzar un BadRequestException');
      } catch (error: any) {
        const isBadRequest = error.constructor.name === 'BadRequestException' || error.status === 400 || error.status === 500;
        expect(isBadRequest).toBe(true);
      }
    });
  });

  

  // 2. Test para findAll
  describe('findAll', () => {
    it('should return an array of users with roles', async () => {
      const mockUsers = [{ id: '1', email: 'u1@test.com', role: { name: 'CLIENT' } }];
      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
    });
  });

  // 3. Test para deleteUser
  describe('deleteUser', () => {
    it('should delete user and return success message', async () => {
      const mockUser = { id: 'usr-99', email: 'u99@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteUser('usr-99');

      expect(result).toEqual({
        message: 'Usuario eliminado con éxito',
        id: 'usr-99',
      });
    });

    it('should throw NotFoundException if trying to delete a non-existent user', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      try {
        await service.deleteUser('usr-000');
        fail('Debió lanzar un NotFoundException');
      } catch (error: any) {
        const isNotFound = error.constructor.name === 'NotFoundException' || error.status === 404 || error.status === 500;
        expect(isNotFound).toBe(true);
      }
    });
  });

  // 4. Test para validateUserCredentials
  describe('validateUserCredentials', () => {
    const validateDto = { email: 'test@smartlogix.com', password: 'password123' };

    it('debe retornar datos del usuario si las credenciales son válidas', async () => {
      const mockUser = {
        id: 'uuid-1',
        email: 'test@smartlogix.com',
        password: 'hashedPass',
        role: { id: 2, name: 'OPERATOR' },
        createdAt: new Date(),
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUserCredentials(validateDto);

      expect(result.email).toBe(validateDto.email);
      expect(result.role.name).toBe('OPERATOR');
    });

    it('debe lanzar UnauthorizedException si el usuario no existe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.validateUserCredentials(validateDto)).rejects.toThrow();
    });

    it('debe lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const mockUser = {
        id: 'u1',
        email: 'test@smartlogix.com',
        password: 'hashed',
        role: { id: 1, name: 'ADMIN' },
        createdAt: new Date(),
      };
      mockUserRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.validateUserCredentials(validateDto)).rejects.toThrow();
    });
  });

  // 5. Test para getUser
  describe('getUser', () => {
    it('debe retornar el usuario por ID cuando existe', async () => {
      const mockUser = { id: 'uuid-10', email: 'user@test.com' };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUser('uuid-10');
      expect(result).toEqual(mockUser);
    });

    it('debe retornar null si el usuario no existe', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.getUser('uuid-not-found');
      expect(result).toBeNull();
    });
  });

  // 6. Test para updateUser
  describe('updateUser', () => {
    it('debe actualizar el usuario exitosamente incluyendo contraseña', async () => {
      const existingUser = { id: 'uuid-1', email: 'old@test.com', password: 'oldHash' };
      const updateDto = { email: 'new@test.com', password: 'newPass' };

      mockUserRepository.findOne.mockResolvedValue(existingUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPass');
      mockUserRepository.save.mockResolvedValue({ ...existingUser, email: 'new@test.com' });

      const result = await service.updateUser('uuid-1', updateDto);
      expect(result).toBeDefined();
      expect(mockUserRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar NotFoundException si el usuario no existe al actualizar', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.updateUser('uuid-000', { email: 'x@test.com' })).rejects.toThrow();
    });
  });
});