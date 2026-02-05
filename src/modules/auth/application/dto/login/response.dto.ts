import { Expose, Type } from "class-transformer";


export class LoginResponseDto {
  @Expose()
  access_token: string;

  @Expose()
  refresh_token: string;
  
}