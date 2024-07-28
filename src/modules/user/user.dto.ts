import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsUrl, IsDate, IsInt } from 'class-validator';

export class UserDto {
  @ApiProperty()
  @IsInt()
  id: number;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsUrl()
  profilePicture: string;

  @ApiProperty()
  @IsDate()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  updatedAt: Date;
}
