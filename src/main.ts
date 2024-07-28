import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
// import { ResponseInterceptor } from './shared/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  // const logger = app.get(Logger);

  app.enable('trust proxy');
  // app.useLogger(logger);
  app.enableCors();
  app.setGlobalPrefix('api/v1', {
    exclude: ['/', 'health', 'api', 'api/v1', 'api/docs'],
  });

  const options = new DocumentBuilder()
    .setTitle('Hospyta Backend API')
    .setDescription('<project-description-here>')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  const port = app.get<ConfigService>(ConfigService).get<number>('server.port');
  await app.listen(port);

  // logger.log({
  //   message: 'server started 🚀',
  //   port,
  //   url: `http://localhost:${port}/api/v1`,
  // });
}
bootstrap().catch((err) => {
  console.error('Error during bootstrap', err);
  process.exit(1);
});
