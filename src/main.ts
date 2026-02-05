import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  //SWAGGER CONFIGURATION
  const configuration = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API documentation')
    .setVersion('0.1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, configuration);
  SwaggerModule.setup('docs', app, document);

  //ENABLE VALIDATION PIPES GLOBALLY
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true}));

  await app.listen(process.env.PORT ?? 3000);

}
bootstrap();
