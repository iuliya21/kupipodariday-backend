import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { WishesService } from 'src/wishes/wishes.service';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async findMany() {
    return await this.wishListsRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }

  async create(createWishlistDto: CreateWishlistDto, user: User) {
    const items = await this.wishesService.findMany(createWishlistDto.itemsId);
    const wishList = this.wishListsRepository.create({
      ...createWishlistDto,
      items,
      owner: user,
    });
    return await this.wishListsRepository.save(wishList);
  }

  async findOne(id: number) {
    const wishlist = await this.wishListsRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
    delete wishlist.owner.password;
    delete wishlist.owner.email;
    return wishlist;
  }

  async updateOne(
    user: User,
    updateWishlistDto: UpdateWishlistDto,
    wishlistId: number,
  ) {
    const wishlist = await this.findOne(wishlistId);

    if (user.id !== wishlist.owner.id) {
      throw new ForbiddenException(
        `You cannot change another user's gift collection`,
      );
    }

    const wishes = await this.wishesService.findMany(updateWishlistDto.itemsId);

    return await this.wishListsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: wishes,
    });
  }

  async remove(wishlistId: number, userId: number) {
    const wishlist = await this.findOne(wishlistId);
    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException(
        `You cannot remove another user's gift collection`,
      );
    }
    await this.wishListsRepository.delete(wishlistId);

    return wishlist;
  }
}
