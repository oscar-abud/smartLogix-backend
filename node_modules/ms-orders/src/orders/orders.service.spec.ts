import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { NotFoundException } from '@nestjs/common';

describe('OrdersService', () => {
  let service: OrdersService;
  let orderRepository: Repository<Order>;
  let dataSource: DataSource;
  let httpService: HttpService;

  // 1. Mock del repositorio básico de TypeORM
  const mockOrderRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  // 2. Mock del DataSource para soportar la arquitectura transaccional de QueryRunner
  const mockQueryRunner = {
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn(),
    },
  };

  const mockDataSource = {
    createQueryRunner: jest.fn(() => mockQueryRunner),
  };

  // 3. Mock del HttpService para las llamadas salientes del microservicio
  const mockHttpService = {
    post: jest.fn(),
    get: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    orderRepository = module.get<Repository<Order>>(getRepositoryToken(Order));
    dataSource = module.get<DataSource>(DataSource);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined (El servicio debe instanciarse correctamente)', () => {
    expect(service).toBeDefined();
  });

  // Test para el método findAll
  describe('findAll', () => {
    it('should return an array of orders from repository', async () => {
      const mockOrders = [
        { id: 1, status: 'PENDING', createdAt: new Date(), items: [] },
      ];
      mockOrderRepository.find.mockResolvedValue(mockOrders);

      const result = await service.findAll();

      expect(result).toEqual(mockOrders);
      expect(mockOrderRepository.find).toHaveBeenCalledWith({
        relations: { items: true },
        order: { createdAt: 'DESC' },
      });
    });
  });

  // Test para el método findOrderById
  describe('findOrderById', () => {
    it('should return an order if found', async () => {
      const mockOrder = { id: 50, status: 'PROCESSED', items: [] };
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);

      const result = await service.findOrderById(50);

      expect(result).toEqual(mockOrder);
      expect(mockOrderRepository.findOne).toHaveBeenCalledWith({
        where: { id: 50 },
        relations: { items: true },
        order: { createdAt: 'DESC' },
      });
    });

    it('should throw NotFoundException if order does not exist', async () => {
      // Forzamos a que el repositorio devuelva null (orden no encontrada)
      mockOrderRepository.findOne.mockResolvedValue(null);

      try {
        await service.findOrderById(999);
        // Si no lanza la excepción, obligamos al test a fallar
        fail('Debió lanzar una excepción');
      } catch (error: any) {
      }
    });
  });

  // Test para el método updateStatus
  describe('updateStatus', () => {
    it('should update the order status successfully', async () => {
      const existingOrder = { id: 10, status: 'PENDING' };
      const updateDto = { status: 'PROCESSED' as const };
      const savedOrder = { id: 10, status: 'PROCESSED' };

      mockOrderRepository.findOne.mockResolvedValue(existingOrder);
      mockOrderRepository.save.mockResolvedValue(savedOrder);

      const result = await service.updateStatus(10, updateDto);

      expect(result).toEqual(savedOrder);
      expect(mockOrderRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'PROCESSED' }),
      );
    });

    it('should throw NotFoundException when trying to update a non-existent order', async () => {
      mockOrderRepository.findOne.mockResolvedValue(null);

      try {
        await service.updateStatus(999, { status: 'CANCELLED' as const });
        fail('Debió lanzar una excepción NotFoundException');
      } catch (error: any) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  // Test para el método remove
  describe('remove', () => {
    it('should remove the order and return a success message', async () => {
      const mockOrder = { id: 30, status: 'PENDING' };
      mockOrderRepository.findOne.mockResolvedValue(mockOrder);
      mockOrderRepository.remove.mockResolvedValue(mockOrder);

      const result = await service.remove(30);

      expect(result).toEqual({
        message: 'Orden #30 eliminada correctamente de forma lógica/física.',
      });
      expect(mockOrderRepository.remove).toHaveBeenCalledWith(mockOrder);
    });
  });
});