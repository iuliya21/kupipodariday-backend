import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from 'src/guards/jwt.guard';

interface UserRequest extends Request {
  user: User;
}

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtGuard)
  @Post('find')
  async findMany(@Body() body: { query: string }) {
    try {
      return await this.usersService.findAllUsers(body.query);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('me')
  me(@Req() req: UserRequest) {
    try {
      return this.usersService.findOne(req.user.id);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get('me/wishes')
  async getMyWishes(@Req() req: UserRequest) {
    const { id } = req.user;
    try {
      return await this.usersService.findMyWishes(id);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get(':username')
  async getUserByAllCredentials(@Param() params: { username: string }) {
    try {
      return await this.usersService.findUserByAllCredentials(params.username);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Get(':username/wishes')
  async getUsersWishes(@Param() params: { username: string }) {
    try {
      const user = await this.usersService.findUserByAllCredentials(
        params.username,
      );
      return await this.usersService.findMyWishes(user.id);
    } catch (error) {
      console.error(error);
    }
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  async updateUser(
    @Req() req: UserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.usersService.findOne(req.user.id);
    if (!user) {
      throw new ForbiddenException('You update only your profile');
    }
    const { id } = req.user;
    await this.usersService.updateOne(id, updateUserDto);
    return this.usersService.findOne(id);
  }
}
