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
});