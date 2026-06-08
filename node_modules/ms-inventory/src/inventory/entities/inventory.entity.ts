import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { InventoryItem } from './inventory-item.entity';
import { UserInventory } from './user-inventory.entity';

@Entity('inventories')
export class Inventory {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'text', nullable: true })
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // Relación local: Un almacén tiene muchos items
  @OneToMany(() => InventoryItem, (item) => item.inventory)
  items!: InventoryItem[];

  // Relación local: Un almacén tiene muchas asignaciones de usuarios
  @OneToMany(() => UserInventory, (userInv) => userInv.inventory)
  userAssignments!: UserInventory[];
}