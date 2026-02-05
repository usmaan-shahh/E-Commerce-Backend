import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import type { ITokenService } from "../ports/token-service";
import type { IUserService } from "../ports/user-service";
import type { IPasswordHasher } from "../ports/password-hasher";



@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUserService') private readonly UserServiceInterface: IUserService,
    @Inject('ITokenService') private readonly TokenServiceInterface: ITokenService,
    @Inject('IUserService') private readonly PassWordHasherInterface: IPasswordHasher,
  ) {}

  async execute(email: string, password: string) {

    const user = await this.UserServiceInterface.findByEmail(email, true);
    if (!user) throw new UnauthorizedException('Invalid Credentials');

    const isMatch = await this.PassWordHasherInterface.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Invalid Credentials');

    const accessToken = this.TokenServiceInterface.issueAccessToken({sub: user.id});

    const refreshToken = this.TokenServiceInterface.issueRefreshToken({sub: user.id});

    return {accessToken, refreshToken}
   
  }
}
