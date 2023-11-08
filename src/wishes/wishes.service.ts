import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Wish } from './entities/wish.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async updateRise(id: number, newRise: number): Promise<UpdateResult> {
    return await this.wishesRepository.update({ id: id }, { raised: newRise });
  }

  async create(owner: User, createWishDto: CreateWishDto) {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: owner,
    });
  }

  async getLastWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 20,
    });
  }

  async getTopWishes(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      where: {
        copied: MoreThan(0),
      },
      take: 10,
    });
  }

  async findOne(wishId: number): Promise<Wish> {
    return await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: {
          wishes: true,
          wishlists: true,
        },
        offers: {
          user: true,
          item: true,
        },
      },
    });
  }

  async updateOne(wishId: number, updatedWish: UpdateWishDto, userId: number) {
    const wish = await this.findOne(wishId);

    if (userId !== wish.owner.id) {
      throw new ForbiddenException('You cannot change cards another users');
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(
        'You cannot change cards for which already collecting money',
      );
    }
    return await this.wishesRepository.update(wishId, updatedWish);
  }

  async remove(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('You cannot delete cards another users');
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(
        'You cannot delete cards for which already collecting money',
      );
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  async findMany(items: number[]): Promise<Wish[]> {
    return this.wishesRepository.findBy({ id: In(items) });
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);
    if (user.id === wish.owner.id) {
      throw new ForbiddenException('This card already exist');
    }
    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });
    const wishCopy = {
      ...wish,
      raised: 0,
      owner: user.id,
      offers: [],
    };
    await this.create(user, wishCopy);
    return {};
  }
}
