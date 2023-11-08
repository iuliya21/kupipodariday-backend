import { Module } from '@nestjs/common';
import { WishesService } from './wishes.service';
import { WishesController } from './wishes.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [ConfigModule, TypeOrmModule.forFeature([Wish]), UsersModule],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {
  constructor(private readonly configService: ConfigService) {
    const entities = this.configService.get<string[]>('database.entities');
    if (!Array.isArray(entities) || !entities.includes(Wish.name)) {
      console.error('Import error: not found in module options');
    }
  }
}
