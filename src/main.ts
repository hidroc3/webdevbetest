import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { BigIntInterceptor } from './common/interceptors/bigint.interceptor';
import { seedDatabase } from '../prisma/seed';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Disable 'X-Powered-By' header for security
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.disable('x-powered-by');

  // CORS reverse proxy
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Authorization,Content-Type',
  });

  // Prefix global
  app.setGlobalPrefix('api');

  // Interceptor & Validation
  app.useGlobalInterceptors(new BigIntInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
    }),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('FFews API')
    .setDescription('API documentation for FFEWS system')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Masukkan JWT token di sini',
        in: 'header',
      },
      'access-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Seed
  try {
    await seedDatabase();
    console.log('✅ Database seed berhasil dijalankan');
  } catch (err) {
    console.error('❌ Seed gagal:', err);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`Server running on http://localhost:${port}/api`);
}

bootstrap();
