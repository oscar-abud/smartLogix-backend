import { Test, TestingModule } from '@nestjs/testing';
import { InventoryService } from './inventory.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Inventory } from './entities/inventory.entity';
import { InventoryItem } from './entities/inventory-item.entity';
import { InventoryType } from './entities/inventory-type.entity';
import { DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('InventoryService', () => {
  let service: InventoryService;

  const mockInventoryRepository = {
    findOne: jest.fn(),
    delete: jest.fn(),
    manager: {
      query: jest.fn(),
    },
    createQueryBuilder: jest.fn(),
  };

  const mockItemRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockTypeRepository = {
    findOne: jest.fn(),
    find: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      create: jest.fn(),
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventoryService,
        {
          provide: getRepositoryToken(Inventory),
          useValue: mockInventoryRepository,
        },
        {
          provide: getRepositoryToken(InventoryItem),
          useValue: mockItemRepository,
        },
        {
          provide: getRepositoryToken(InventoryType),
          useValue: mockTypeRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined (El servicio debe instanciarse correctamente)', () => {
    expect(service).toBeDefined();
  });

  describe('createInventoryType', () => {
    it('debe crear un tipo de inventario exitosamente', async () => {
      const dto = { name: 'Tecnología', description: 'Dispositivos tecnológicos' };
      const savedType = { id: 1, ...dto };
      mockTypeRepository.findOne.mockResolvedValue(null);
      mockTypeRepository.create.mockReturnValue(savedType);
      mockTypeRepository.save.mockResolvedValue(savedType);

      const result = await service.createInventoryType(dto);
      expect(result).toEqual(savedType);
      expect(mockTypeRepository.save).toHaveBeenCalled();
    });

    it('debe lanzar BadRequestException si el tipo ya existe', async () => {
      mockTypeRepository.findOne.mockResolvedValue({ id: 1, name: 'Tecnología' });

      await expect(
        service.createInventoryType({ name: 'Tecnología' }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllInventoryTypes', () => {
    it('debe retornar todos los tipos de inventario ordenados', async () => {
      const types = [
        { id: 1, name: 'Tecnología' },
        { id: 2, name: 'Muebles' },
      ];
      mockTypeRepository.find.mockResolvedValue(types);

      const result = await service.getAllInventoryTypes();
      expect(result).toEqual(types);
      expect(mockTypeRepository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });
  });

  describe('getItemById', () => {
    it('debe retornar el ítem cuando existe', async () => {
      const item = { id: 10, sku: 'SKU-001', name: 'Laptop', price: 999 };
      mockItemRepository.findOne.mockResolvedValue(item);

      const result = await service.getItemById(10);
      expect(result).toEqual(item);
      expect(mockItemRepository.findOne).toHaveBeenCalledWith({ where: { id: 10 } });
    });

    it('debe lanzar NotFoundException si el ítem no existe', async () => {
      mockItemRepository.findOne.mockResolvedValue(null);

      await expect(service.getItemById(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getItems', () => {
    it('debe retornar todos los ítems del inventario', async () => {
      const items = [{ id: 1, sku: 'A', name: 'Monitor' }];
      mockItemRepository.find.mockResolvedValue(items);

      const result = await service.getItems();
      expect(result).toEqual(items);
    });
  });

  describe('addItemToInventory', () => {
    const dto = {
      sku: 'SKU-NEW',
      name: 'Monitor',
      price: 500,
      stockAvailable: 10,
      inventoryId: 1,
      typeId: 1,
    };

    it('debe agregar un ítem al almacén exitosamente', async () => {
      const inventory = { id: 1, name: 'Bodega' };
      const newItem = { id: 55, ...dto, stockReserved: 0 };
      mockInventoryRepository.findOne.mockResolvedValue(inventory);
      mockItemRepository.findOne.mockResolvedValue(null);
      mockItemRepository.create.mockReturnValue(newItem);
      mockItemRepository.save.mockResolvedValue(newItem);

      const result = await service.addItemToInventory(1, dto);
      expect(result).toEqual(newItem);
    });

    it('debe lanzar NotFoundException si el almacén no existe', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(null);

      await expect(service.addItemToInventory(999, dto)).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si el SKU ya está registrado', async () => {
      mockInventoryRepository.findOne.mockResolvedValue({ id: 1 });
      mockItemRepository.findOne.mockResolvedValue({ id: 2, sku: 'SKU-NEW' });

      await expect(service.addItemToInventory(1, dto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateItemStock', () => {
    it('debe incrementar el stock correctamente', async () => {
      mockItemRepository.findOne.mockResolvedValue({ id: 5, sku: 'SKU-A', stockAvailable: 10 });
      mockItemRepository.save.mockResolvedValue({ id: 5, sku: 'SKU-A', stockAvailable: 15 });

      const result = await service.updateItemStock(5, { quantity: 5 });
      expect(result.newStock).toBe(15);
      expect(result.message).toContain('incrementado');
    });

    it('debe descontar el stock correctamente', async () => {
      mockItemRepository.findOne.mockResolvedValue({ id: 5, sku: 'SKU-A', stockAvailable: 10 });
      mockItemRepository.save.mockResolvedValue({ id: 5, sku: 'SKU-A', stockAvailable: 7 });

      const result = await service.updateItemStock(5, { quantity: -3 });
      expect(result.message).toContain('descontado');
    });

    it('debe lanzar NotFoundException si el ítem no existe', async () => {
      mockItemRepository.findOne.mockResolvedValue(null);

      await expect(service.updateItemStock(999, { quantity: 5 })).rejects.toThrow(NotFoundException);
    });

    it('debe lanzar BadRequestException si el stock es insuficiente para descontar', async () => {
      mockItemRepository.findOne.mockResolvedValue({ id: 5, sku: 'A', stockAvailable: 2 });

      await expect(service.updateItemStock(5, { quantity: -10 })).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteInventory', () => {
    it('debe eliminar el almacén exitosamente', async () => {
      mockInventoryRepository.findOne.mockResolvedValue({ id: 3, name: 'Bodega Sur' });
      mockInventoryRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteInventory(3);
      expect(result).toEqual({
        message: 'Almacén y sus dependencias eliminados con éxito',
        id: 3,
      });
    });

    it('debe lanzar NotFoundException si el almacén no existe', async () => {
      mockInventoryRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteInventory(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('assignUser', () => {
    it('debe asignar un usuario a un almacén exitosamente', async () => {
      mockInventoryRepository.manager.query.mockResolvedValue([]);

      const result = await service.assignUser(1, 'uuid-user-123');
      expect(result.success).toBe(true);
      expect(mockInventoryRepository.manager.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('updateUserRelation', () => {
    it('debe actualizar la relación de almacén de un usuario exitosamente', async () => {
      mockInventoryRepository.manager.query.mockResolvedValue([]);

      const result = await service.updateUserRelation(2, 'uuid-user-abc');
      expect(result.success).toBe(true);
      expect(mockInventoryRepository.manager.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('removeUserRelation', () => {
    it('debe desvincular un usuario de un almacén exitosamente', async () => {
      mockInventoryRepository.manager.query.mockResolvedValue([]);

      const result = await service.removeUserRelation(1, 'uuid-user-123');
      expect(result.success).toBe(true);
    });
  });

  describe('getAll', () => {
    it('debe retornar todos los inventarios con totalizadores', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawAndEntities: jest.fn().mockResolvedValue({
          entities: [{ id: 1, name: 'Bodega Central', items: [] }],
          raw: [{ inventory_id: 1, totalItems: '3', userIds: '["uuid-u1"]' }],
        }),
      };
      mockInventoryRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getAll();
      expect(result).toHaveLength(1);
      expect(result[0].totalItems).toBe(3);
      expect(result[0].totalUsers).toBe(1);
    });
  });

  describe('getInventory', () => {
    it('debe retornar un almacén específico por ID', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawAndEntities: jest.fn().mockResolvedValue({
          entities: [{ id: 5, name: 'Bodega Norte', description: 'Norte', createdAt: new Date(), items: [] }],
          raw: [{ totalItems: '2', userIds: '["uuid-u2","uuid-u3"]' }],
        }),
      };
      mockInventoryRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.getInventory(5);
      expect(result.id).toBe(5);
      expect(result.totalUsers).toBe(2);
    });

    it('debe lanzar NotFoundException si el almacén no existe en getInventory', async () => {
      const mockQueryBuilder = {
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: [], raw: [] }),
      };
      mockInventoryRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.getInventory(999)).rejects.toThrow(NotFoundException);
    });
  });
});
