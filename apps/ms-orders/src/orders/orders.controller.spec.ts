import { Test, TestingModule } from '@nestjs/testing';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

describe('OrdersController', () => {
  let controller: OrdersController;

  const mockOrdersService = {
    findAll: jest.fn(),
    findOrderById: jest.fn(),
    create: jest.fn(),
    updateStatus: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrdersController],
      providers: [
        {
          provide: OrdersService,
          useValue: mockOrdersService,
        },
      ],
    }).compile();

    controller = module.get<OrdersController>(OrdersController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined (El controlador debe compilar correctamente)', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('debe retornar el listado de órdenes', async () => {
      const mockOrders = [{ id: 1, status: 'PENDING', items: [] }];
      mockOrdersService.findAll.mockResolvedValue(mockOrders);

      const result = await controller.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrdersService.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOrderById', () => {
    it('debe retornar una orden específica por ID', async () => {
      const mockOrder = { id: 5, status: 'PROCESSED', items: [] };
      mockOrdersService.findOrderById.mockResolvedValue(mockOrder);

      const result = await controller.findOrderById(5);

      expect(result).toEqual(mockOrder);
      expect(mockOrdersService.findOrderById).toHaveBeenCalledWith(5);
    });
  });

  describe('create', () => {
    it('debe crear una orden nueva y retornar el resultado', async () => {
      const createDto = { items: [{ productId: 1, quantity: 2 }] };
      const mockResult = { message: 'Orden creada', orderId: 10, totalAmount: 2000 };
      mockOrdersService.create.mockResolvedValue(mockResult);

      const result = await controller.create(createDto as any);

      expect(result).toEqual(mockResult);
      expect(mockOrdersService.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('updateStatus', () => {
    it('debe actualizar el estado de una orden', async () => {
      const updateDto = { status: 'PROCESSED' as const };
      const updatedOrder = { id: 10, status: 'PROCESSED' };
      mockOrdersService.updateStatus.mockResolvedValue(updatedOrder);

      const result = await controller.updateStatus(10, updateDto);

      expect(result).toEqual(updatedOrder);
      expect(mockOrdersService.updateStatus).toHaveBeenCalledWith(10, updateDto);
    });
  });

  describe('remove', () => {
    it('debe eliminar la orden y retornar mensaje de éxito', async () => {
      const mockResult = { message: 'Orden #30 eliminada correctamente de forma lógica/física.' };
      mockOrdersService.remove.mockResolvedValue(mockResult);

      const result = await controller.remove(30);

      expect(result).toEqual(mockResult);
      expect(mockOrdersService.remove).toHaveBeenCalledWith(30);
    });
  });
});
