import { ApiProperty } from '@nestjs/swagger';
import { UserDto } from '../../user/user.dto';

export class AuthResponse {
  @ApiProperty()
  user: UserDto;

  @ApiProperty()
  token: string;
}
