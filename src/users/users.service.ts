import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ProviderHash } from 'src/utils';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    return await this.usersRepository.findOneBy({
      email,
    });
  }

  async findUserByName(username: string) {
    return await this.usersRepository.findOne({
      where: {
        username: username,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const username = await this.findUserByName(createUserDto.username);
    const email = await this.findByEmail(createUserDto.email);

    if (username !== null) {
      throw new ForbiddenException('User with this name already exists');
    }
    if (email) {
      throw new ForbiddenException('User with this email already exists');
    }

    const user = this.usersRepository.create(createUserDto);
    user.password = await ProviderHash.createHash(user.password);

    return await this.usersRepository.save(user);
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneBy({ id });
      if (!user) {
        throw new NotFoundException(`User with this ${id} not found`);
      }

      return user;
    } catch (error) {
      console.error(error);
    }
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await ProviderHash.createHash(
          updateUserDto.password,
        );
      }
      if (updateUserDto.username) {
        const username = await this.findUserByName(updateUserDto.username);
        if (username !== null && username.id !== id) {
          throw new ForbiddenException('User this login already exist');
        }
      }
      if (updateUserDto.email) {
        const email = await this.findByEmail(updateUserDto.email);
        if (email !== null && email.id !== id) {
          throw new ForbiddenException('User this email already exist');
        }
      }
      await this.usersRepository.update({ id }, updateUserDto);
      const updatedUser = await this.findOne(id);
      return updatedUser;
    } catch (error) {
      console.error(error);
    }
  }

  async findUserByAllCredentials(username: string) {
    const user = await this.usersRepository.findOne({
      select: ['id', 'username', 'about', 'avatar', 'createdAt', 'updatedAt'],
      where: { username },
    });
    if (!user) {
      throw new NotFoundException(`User ${username} not found`);
    }
    return user;
  }

  async checkJwt(id: number) {
    return await this.usersRepository.find({
      select: {
        id: true,
        username: true,
      },
      where: {
        id,
      },
    });
  }

  async findAllUsers(query: string) {
    return await this.usersRepository.find({
      where: [{ username: query }, { email: query }],
    });
  }

  async findMyWishes(id: number) {
    const user = await this.usersRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User with ${id} not found`);
    }
    const wishes = await this.usersRepository.find({
      select: ['wishes'],
      relations: {
        wishes: {
          owner: true,
          offers: {
            user: {
              wishes: true,
              offers: true,
              wishlists: {
                owner: true,
                items: true,
              },
            },
          },
        },
      },
      where: {
        id: id,
      },
    });

    const arrayWishes = wishes.map((item) => item.wishes);

    return arrayWishes[0];
  }
}
