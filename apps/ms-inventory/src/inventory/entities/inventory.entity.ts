import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
  
  // @Column()
  // id_category!: string

  @Column({ unique: true })
  name!: string;

  @Column()
  description!: string;

  @Column()
  price!: number;

  @Column({ default: 0 })
  quantity!: number;

  @CreateDateColumn()
  createdAt!: Date;
}