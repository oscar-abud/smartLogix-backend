import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { Inventory } from './inventory.entity';

@Entity('user_inventories')
@Unique(['userId', 'inventoryId'])
export class UserInventory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'user_id', type: 'varchar', length: 255 })
  userId!: string;

  @Column({ name: 'inventory_id', type: 'int' })
  inventoryId!: number;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt!: Date;

  // Relación física local con Inventories
  @ManyToOne(() => Inventory, (inventory) => inventory.userAssignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory;
}