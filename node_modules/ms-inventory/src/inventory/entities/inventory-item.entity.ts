import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { InventoryType } from './inventory-type.entity';
import { Inventory } from './inventory.entity';

@Entity('inventory_items')
export class InventoryItem {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ type: 'varchar', length: 255 })
  sku!: string;

  @Column({ type: 'varchar', length: 255 })
  name!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price!: number;

  @Column({ name: 'stock_available', type: 'int', default: 0 })
  stockAvailable!: number;

  @Column({ name: 'stock_reserved', type: 'int', default: 0 })
  stockReserved!: number;

  @Column({ name: 'inventory_type_id', type: 'int' })
  inventoryTypeId!: number;

  @Column({ name: 'inventory_id', type: 'int' })
  inventoryId!: number;

  @CreateDateColumn({ name: 'createdAt' })
createdAt!: Date;

  // ==========================================
  // RELACIONES FÍSICAS LOCALES (Muchos a Uno)
  // ==========================================

  // Conexión con la categoría del producto
  @ManyToOne(() => InventoryType, (type) => type.items, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'inventory_type_id' })
  inventoryType!: InventoryType;

  // Conexión con el Almacén/Bodega donde duerme el producto
  @ManyToOne(() => Inventory, (inventory) => inventory.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory!: Inventory;
}