import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUsersService = {
    findAll: jest.fn(),
    getUser: jest.fn(),
    validateUserCredentials: jest.fn(),
    registerUser: jest.fn(),
    updateUser: jest.fn(),
    deleteUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined (El controlador debe compilar correctamente)', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar el listado de usuarios', async () => {
      const mockUsers = [{ id: '1', email: 'a@test.com', role: { name: 'ADMIN' } }];
      mockUsersService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUsersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findUser', () => {
    it('debe retornar un usuario específico por ID', async () => {
      const mockUser = { id: 'uuid-1', email: 'user@test.com' };
      mockUsersService.getUser.mockResolvedValue(mockUser);

      const result = await controller.findUser('uuid-1');

      expect(result).toEqual(mockUser);
      expect(mockUsersService.getUser).toHaveBeenCalledWith('uuid-1');
    });
  });

  describe('validateUser', () => {
    it('debe validar las credenciales y retornar los datos del usuario', async () => {
      const validateDto = { email: 'user@test.com', password: 'pass123' };
      const mockResult = { id: 'uuid-1', email: 'user@test.com', role: { id: 1, name: 'ADMIN' } };
      mockUsersService.validateUserCredentials.mockResolvedValue(mockResult);

      const result = await controller.validateUser(validateDto);

      expect(result).toEqual(mockResult);
      expect(mockUsersService.validateUserCredentials).toHaveBeenCalledWith(validateDto);
    });
  });

  describe('registerUser', () => {
    it('debe registrar un nuevo usuario y retornar sus datos', async () => {
      const createDto = { email: 'new@test.com', password: 'pass123', roleId: 2 };
      const mockResult = { id: 'new-uuid', email: 'new@test.com', id_role: 2, rol: 'OPERATOR' };
      mockUsersService.registerUser.mockResolvedValue(mockResult);

      const result = await controller.registerUser(createDto);

      expect(result).toEqual(mockResult);
      expect(mockUsersService.registerUser).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateUser', () => {
    it('debe actualizar el usuario y retornar el resultado', async () => {
      const updateDto = { email: 'updated@test.com' };
      const mockResult = { id: 'uuid-1', email: 'updated@test.com' };
      mockUsersService.updateUser.mockResolvedValue(mockResult);

      const result = await controller.updateUser('uuid-1', updateDto);

      expect(result).toEqual(mockResult);
      expect(mockUsersService.updateUser).toHaveBeenCalledWith('uuid-1', updateDto);
    });
  });

  describe('deleteUser', () => {
    it('debe eliminar el usuario y retornar mensaje de éxito', async () => {
      const mockResult = { message: 'Usuario eliminado con éxito', id: 'uuid-1' };
      mockUsersService.deleteUser.mockResolvedValue(mockResult);

      const result = await controller.deleteUser('uuid-1');

      expect(result).toEqual(mockResult);
      expect(mockUsersService.deleteUser).toHaveBeenCalledWith('uuid-1');
    });
  });
});
