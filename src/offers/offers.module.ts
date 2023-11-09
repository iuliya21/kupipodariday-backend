import { Module } from '@nestjs/common';
import { OffersService } from './offers.service';
import { OffersController } from './offers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Offer } from './entities/offer.entity';
import { offerDependencies } from 'src/dependencies/offers';

@Module({
  imports: [TypeOrmModule.forFeature([Offer]), ...offerDependencies],
  controllers: [OffersController],
  providers: [OffersService],
})
export class OffersModule {}
