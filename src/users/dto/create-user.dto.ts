import { IsEmail, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateUserDto {
  @Length(2, 30)
  username: string;

  @Length(2, 300)
  @IsOptional()
  about: string;

  @IsOptional()
  @IsUrl()
  avatar: string;

  @IsEmail()
  email: string;

  password: string;
}
