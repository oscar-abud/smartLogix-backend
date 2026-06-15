import { Test, TestingModule } from '@nestjs/testing';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

describe('InventoryController', () => {
  let controller: InventoryController;
  let service: InventoryService;

  // 1. Mocks corregidos con los nombres exactos de funciones que usa tu controlador
  const mockInventoryService = {
    getAll: jest.fn(),
    getAllInventoryTypes: jest.fn(),
    getItems: jest.fn(),
    getItemById: jest.fn(),
    getInventory: jest.fn(),
    registerInventory: jest.fn(),
    createInventoryType: jest.fn(),
    assignUser: jest.fn(),
    addItemToInventory: jest.fn(),
    updateUserRelation: jest.fn(),
    updateItemStock: jest.fn(),
    removeUserRelation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        {
          provide: InventoryService,
          useValue: mockInventoryService,
        },
      ],
    }).compile();

    controller = module.get<InventoryController>(InventoryController);
    service = module.get<InventoryService>(InventoryService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined (El controlador debe compilar correctamente)', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all inventories', async () => {
      const mockInventories = [
        { id: 1, name: 'Bodega Central', description: 'Santiago' },
      ];
      mockInventoryService.getAll.mockResolvedValue(mockInventories);

      const result = await controller.findAll();

      expect(result).toEqual(mockInventories);
      expect(mockInventoryService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getTypes', () => {
    it('should return all inventory types', async () => {
      const mockTypes = [{ id: 1, name: 'Tecnología', description: 'Gadgets' }];
      mockInventoryService.getAllInventoryTypes.mockResolvedValue(mockTypes);

      const result = await controller.getTypes();

      expect(result).toEqual(mockTypes);
      expect(mockInventoryService.getAllInventoryTypes).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a specific inventory by id', async () => {
      const mockInventory = { id: 10, name: 'Bodega Norte' };
      mockInventoryService.getInventory.mockResolvedValue(mockInventory);

      const result = await controller.findOne(10);

      expect(result).toEqual(mockInventory);
      expect(mockInventoryService.getInventory).toHaveBeenCalledWith(10);
    });
  });

  // Test corregido para alinearse al flujo de registerInventory + userId
  describe('create', () => {
    it('should create a new inventory', async () => {
      const createDto: CreateInventoryDto = {
        name: 'Bodega Nueva',
        description: 'Sector Sur',
      };
      const mockUserId = 'usr-1234';
      const mockResponse = { id: 5, ...createDto };
      
      mockInventoryService.registerInventory.mockResolvedValue(mockResponse);

      const result = await controller.create(createDto, mockUserId);

      expect(result).toEqual(mockResponse);
      expect(mockInventoryService.registerInventory).toHaveBeenCalledWith(createDto, mockUserId);
    });
  });

  describe('addItem', () => {
    it('should add an item to a specific inventory', async () => {
      const inventoryId = 1;
      const createItemDto: CreateItemDto = {
        sku: 'PROD-123',
        name: 'Mouse Gamer',
        price: 25000,
        stockAvailable: 50,
        inventoryId: 1,
        typeId: 2,
      };
      const mockResponse = { id: 99, ...createItemDto };
      mockInventoryService.addItemToInventory.mockResolvedValue(mockResponse);

      const result = await controller.addItem(inventoryId, createItemDto);

      expect(result).toEqual(mockResponse);
      expect(mockInventoryService.addItemToInventory).toHaveBeenCalledWith(
        inventoryId,
        createItemDto,
      );
    });
  });

  describe('updateStock', () => {
    it('should update the stock of an item', async () => {
      const itemId = 50;
      const updateStockDto: UpdateStockDto = { stockAvailable: 120 };
      const mockResponse = { id: itemId, stockAvailable: 120 };
      mockInventoryService.updateItemStock.mockResolvedValue(mockResponse);

      const result = await controller.updateStock(itemId, updateStockDto);

      expect(result).toEqual(mockResponse);
      expect(mockInventoryService.updateItemStock).toHaveBeenCalledWith(
        itemId,
        updateStockDto,
      );
    });
  });

  // Test corregido para alinearse al flujo de removeUserRelation
  describe('removeUserFromInventory', () => {
    it('should remove a user from the inventory relation', async () => {
      const inventoryId = 12;
      const userId = 'usr-abcd';
      const mockResponse = { message: 'Relación eliminada con éxito' };
      
      mockInventoryService.removeUserRelation.mockResolvedValue(mockResponse);

      const result = await controller.removeUserFromInventory(
        inventoryId,
        userId,
      );

      expect(result).toEqual(mockResponse);
      expect(mockInventoryService.removeUserRelation).toHaveBeenCalledWith(
        inventoryId,
        userId,
      );
    });
  });
});