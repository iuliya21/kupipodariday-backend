import {
  ArrayNotEmpty,
  IsArray,
  IsNumber,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber()
  itemsId: number[];

  @IsOptional()
  @Length(10, 500)
  description: string;
}
