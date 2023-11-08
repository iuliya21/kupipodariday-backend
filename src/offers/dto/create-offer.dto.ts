import { IsBoolean, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsBoolean()
  @IsNotEmpty()
  hidden: boolean;

  @IsNumber()
  @IsNotEmpty()
  itemId: number;
}
