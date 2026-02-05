import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth-controller";
import { RegisterUseCase } from "./application/use-cases/register-usecase";
import { JwtTokenService } from "./infrastructure/jwt/jwt-token.service";
import { ConfigModule, ConfigService } from "@nestjs/config";


@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('jwt.accessSecret'),
        expiresIn: config.get<string>('jwt.refreshExpires'),
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'IUserService',
      useClass: UserService,
    },
    RegisterUseCase,
    JwtTokenService,
  ],
  exports: [IUserService],
})
export class AuthModule {}