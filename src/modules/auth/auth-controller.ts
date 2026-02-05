import { Body, Controller, Post } from "@nestjs/common";
import { RegisterUseCase } from "./application/use-cases/register-usecase";
import { RegisterRequestDto } from "./dto/register/request.dto";
import { RegisterResponseDto } from "./dto/register/response.dto";
import { plainToInstance } from "class-transformer";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "./infrastructure/decorators/current-user.decorator";
import { LoginRequestDto } from "./dto/login/reguest.dto";
import { LoginResponseDto } from "./dto/login/response.dto";
import {LoginUseCase} from "./application/use-cases/login-usecase"


@ApiTags('Auth Endpoints')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly loginUseCase: LoginUseCase,
  ) {}

  @Post('register')
  @ApiOperation({ summary: "This Endpoint register's a new user" })
  async register(
    @Body() dto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const res = await this.registerUseCase.execute(dto.email, dto.password);
    return plainToInstance(RegisterResponseDto, res.message );
  }

  @Post('login')
  @ApiOperation({ summary: 'This Endpoint is for login' })
  async login(@Body() body: LoginRequestDto): Promise<LoginResponseDto> {
    const res = await this.loginUseCase.execute(body.email, body.password);
    return plainToInstance(
      LoginResponseDto,
      {
        access_token: res.accessToken,
        refresh_token: res.refreshToken,
        user: res.user
      },
      { excludeExtraneousValues: true }, //Attributes marked with @Expose() in the DTO are included in the result.
    );
  }
}
