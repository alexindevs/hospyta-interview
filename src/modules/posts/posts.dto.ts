import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsPositive,
} from 'class-validator';

export class CreatePostDto {
  @ApiProperty({ description: 'The content of the post' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ description: 'The ID of the user who created the post' })
  @IsNumber()
  @IsPositive()
  userId: number;

  @ApiProperty({ description: 'The category of the post' })
  @IsString()
  @IsNotEmpty()
  category: string;

  @ApiProperty({ description: 'The pictures associated with the post' })
  @IsString()
  @IsOptional()
  pictures?: string;
}

export class UpdatePostDto {
  @ApiProperty({ description: 'The updated content of the post' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiProperty({ description: 'The updated category of the post' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'The updated pictures associated with the post' })
  @IsString()
  @IsOptional()
  pictures?: string;
}

export class CreateCommentDto {
  @ApiProperty({ description: 'The content of the comment' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({
    description: 'The ID of the parent comment, if this is a reply',
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  parentId?: number;
}
