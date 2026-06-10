import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';

@Entity('inventory_types')
export class InventoryType {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt!: Date;

  // Relación: Un tipo de inventario agrupa a muchos productos
  @OneToMany(() => InventoryItem, (item) => item.inventoryType)
  items!: InventoryItem[];
}