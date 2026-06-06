import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number; // 1, 2, 3

  @Column({ unique: true })
  name: string; // 'ADMIN', 'OPERATOR', 'CLIENT'

  @OneToMany(() => User, (user) => user.role)
  users: User[];
}