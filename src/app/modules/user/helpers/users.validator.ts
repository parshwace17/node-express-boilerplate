import { IsString } from 'class-validator';

export class CHANGE_PASSWORD {
  @IsString() old_password: string;
  @IsString() password: string;
}
