import { PartialType } from '@nestjs/swagger';
import { CreateWishlistDto } from './create-wishlist.dto';
import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @Length(1, 250)
  name: string;

  @IsOptional()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber()
  itemsId: number[];

  @IsOptional()
  @Length(10, 1500)
  description: string;
}
