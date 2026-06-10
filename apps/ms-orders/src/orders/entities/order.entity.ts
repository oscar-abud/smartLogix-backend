// src/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

// Definimos un ENUM para controlar el ciclo de vida de la orden
export enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  SHIPPED = 'SHIPPED', // Cuando Express + Mongo ya tomaron el paquete
  CANCELLED = 'CANCELLED',
}

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;

  @Column({ type: 'numeric', precision: 12, scale: 2, name: 'total_amount', default: 0 })
  totalAmount!: number;

  @Column({ type: 'varchar', name: 'user_id', nullable: true })
  userId!: string; // Opcional, simplificado para no trancarte con relaciones complejas de usuarios

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date;

  // Relación uno a muchos: Una orden puede tener varios items (escalable)
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, { cascade: true })
  items!: OrderItem[];
}