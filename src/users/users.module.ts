import { CacheModule, Module, OnModuleInit } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import cacheConfig from 'src/config/cache.config';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CacheModule.register(cacheConfig),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule implements OnModuleInit {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
    const entities = this.configService.get<string[]>('database.entities');

    if (!Array.isArray(entities) || !entities.includes(User.name)) {
      console.error('Import error: not found in module options');
    }
  }
}
