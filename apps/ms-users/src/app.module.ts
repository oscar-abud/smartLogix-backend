import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'users_user',
    password: 'users_password',
    database: 'smartlogix_users',
    entities: [User, Role],
    synchronize: false,
  }),
    UsersModule,
  ],
})
export class AppModule {}