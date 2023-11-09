import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

type Request = {
  user?: any;
};

@UseGuards(JwtGuard)
@Controller('wishlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @UseGuards(JwtGuard)
  @Post()
  async create(
    @Req() req: Request,
    @Body() createWishListDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    try {
      return await this.wishlistsService.create(createWishListDto, req.user);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get()
  async findAll(): Promise<Wishlist[]> {
    try {
      return await this.wishlistsService.findMany();
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Collections not found');
    }
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    try {
      return await this.wishlistsService.findOne(id);
    } catch (error) {
      console.log(error);
      throw new NotFoundException('Collection not found');
    }
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Wishlist> {
    try {
      return await this.wishlistsService.updateOne(
        req.user.id,
        updateWishlistDto,
        +id,
      );
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  async remove(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    try {
      return await this.wishlistsService.remove(id, req.user.id);
    } catch (error) {
      console.error(error);
    }
  }
}
