import { IsEmail, IsString, MaxLength } from 'class-validator';

export class SIGNUP {
  @IsString() @MaxLength(50) first_name: string;
  @IsString() @MaxLength(50) last_name: string;
  @IsEmail() email: string;
  @IsString() password: string;
}

export class LOGIN {
  @IsEmail() email: string;
  @IsString() password: string;
}
