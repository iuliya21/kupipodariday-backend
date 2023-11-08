import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { JwtGuard } from 'src/guards/jwt.guard';

interface UserRequest extends Request {
  user: User;
}

@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(JwtGuard)
  @Post()
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: UserRequest,
  ) {
    const { id } = req.user;
    try {
      const user = await this.usersService.findOne(id);
      return await this.offersService.create(createOfferDto, user);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findOffers() {
    const offers = await this.offersService.findAll();
    if (!offers) {
      throw new NotFoundException('offers not found');
    }
    return offers;
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOfferById(@Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);
    if (!offer) {
      throw new NotFoundException('offer not found');
    }
    return offer;
  }
}
