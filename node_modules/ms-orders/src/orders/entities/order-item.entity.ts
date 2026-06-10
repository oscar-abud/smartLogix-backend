import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'order_id' })
  orderId!: number;

  // Relación hacia la cabecera de la Orden
  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order!: Order;

  // Guardamos el ID del producto que viene de tu otra tabla/microservicio
  @Column({ name: 'product_id' })
  productId!: number;

  @Column({ type: 'int' })
  quantity!: number;

  // Usamos numeric/decimal para precisión de dinero
  @Column({ type: 'numeric', precision: 10, scale: 2 })
  price!: number;
}