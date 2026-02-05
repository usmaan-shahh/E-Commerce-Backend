import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './modules/auth/infrastructure/jwt/token-secret';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
