import { Injectable, BadRequestException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { Order, OrderStatus } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService,
  ) {}

  async findAll() {
    return await this.orderRepository.find({
      relations: {
      items: true,
      },
      order: { 
      createdAt: 'DESC' 
      },
    });
  }

  async findOrderById(orderId: number) {
    try {
      const orden = await this.orderRepository.findOne({
        where: { id: orderId }
      })

      if (!orden) {
        throw new NotFoundException(`El orden con ID ${orderId} no existe en el inventario.`);
      }

      return orden;
    } catch (error) {
      console.error('Error en buscar el orden en OrdersService:', error);
      throw new InternalServerErrorException('No se pudo buscar la orden debido a un problema interno.');
    }
  }

  async create(createOrderDto: CreateOrderDto) {
    const { productId, quantity } = createOrderDto;

    // Endpoint destino para consultar y alterar las existencias físicas
    const inventoryUrl = 'http://localhost:3002/api/inventory'; 

    let productData;
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${inventoryUrl}/items/${productId}`)
      );
      productData = response.data;
    } catch (error) {
      throw new NotFoundException(`El producto con ID ${productId} no existe en el catálogo.`);
    }

    if (productData.stockAvailable < quantity) {
      throw new BadRequestException(
        `Stock insuficiente para el artículo '${productData.name}'. Stock actual: ${productData.stockAvailable}, solicitado: ${quantity}`
      );
    }

    // Cálculos económicos de la venta
    const unitPrice = parseFloat(productData.price);
    const totalAmount = unitPrice * quantity;

    // Iniciar Transacción en PostgreSQL
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Crear e insertar la cabecera limpia (sin user_id)
      const order = new Order();
      order.status = OrderStatus.PENDING;
      order.totalAmount = totalAmount;

      const savedOrder = await queryRunner.manager.save(order);

      // Crear e insertar el detalle del ítem
      const orderItem = new OrderItem();
      orderItem.orderId = savedOrder.id;
      orderItem.productId = productId;
      orderItem.quantity = quantity;
      orderItem.price = unitPrice;

      await queryRunner.manager.save(orderItem);

      // Descontar el stock en ms-inventory de forma síncrona
      await firstValueFrom(
        this.httpService.patch(`${inventoryUrl}/items/${productId}/stock`, {
          quantity: -quantity,
        })
      );

      // Consolidar la transacción si todo anduvo bien
      await queryRunner.commitTransaction();

      return {
        message: 'Orden creada con éxito y existencias descontadas del inventario.',
        orderId: savedOrder.id,
        totalAmount: savedOrder.totalAmount,
        status: savedOrder.status,
        quantity: quantity,
        createdAt: savedOrder.createdAt,
      };

    } catch (transactionError) {
      // Revertir todo en cascada ante cualquier imprevisto de red o base de datos
      await queryRunner.rollbackTransaction();
      console.error('Error transaccional en OrdersService:', transactionError);
      throw new InternalServerErrorException('No se pudo procesar la orden debido a un problema interno.');
    } finally {
      // Liberar el query runner
      await queryRunner.release();
    }
  }

  async updateStatus(orderId: number, updateOrderStatusDto: UpdateOrderStatusDto) {
    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
        
      if (!order) {
        throw new NotFoundException(`La orden con ID ${orderId} no existe.`);
      }

      order.status = updateOrderStatusDto.status;
      return await this.orderRepository.save(order);
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error interno al actualizar el estado de la orden.');
    }
  }

  async remove(orderId: number) {
    try {
      const order = await this.orderRepository.findOne({ where: { id: orderId } });
        
      if (!order) {
      throw new NotFoundException(`La orden con ID ${orderId} no existe.`);
      }

      await this.orderRepository.remove(order);
      return { message: `Orden #${orderId} eliminada correctamente de forma lógica/física.` };
    } catch (error: any) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error interno al intentar eliminar la orden.');
    }
  }
}