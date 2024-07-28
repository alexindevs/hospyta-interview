import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
// import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { PostsModule } from './modules/posts/posts.module';
import * as Joi from 'joi';

import serverConfig from './config/server.config';
import authConfig from './config/auth.config';
import HealthController from './health.controller';

@Module({
  providers: [
    {
      provide: 'CONFIG',
      useClass: ConfigService,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
        }),
    },
  ],
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.PROFILE}`],
      isGlobal: true,
      load: [serverConfig, authConfig],
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .required(),
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        PROFILE: Joi.string()
          .valid(
            'local',
            'development',
            'production',
            'ci',
            'testing',
            'staging',
          )
          .required(),
        PORT: Joi.number().required(),
      }),
    }),
    AuthModule,
    UserModule,
    PostsModule,
    // LoggerModule.forRoot(),
    // // MailerModule.forRootAsync({
    // //   imports: [ConfigModule],
    // //   useFactory: async (configService: ConfigService) => ({
    // //     transport: {
    // //       host: configService.get<string>('SMTP_HOST'),
    // //       port: configService.get<number>('SMTP_PORT'),
    // //       auth: {
    // //         user: configService.get<string>('SMTP_USER'),
    // //         pass: configService.get<string>('SMTP_PASSWORD'),
    // //       },
    // //     },
    // //     defaults: {
    // //       from: `"Team Hospyta" <${configService.get<string>('SMTP_USER')}>`,
    // //     },
    // //     template: {
    // //       dir: process.cwd() + '/src/modules/email/templates',
    // //       adapter: new HandlebarsAdapter(),
    // //       options: {
    // //         strict: true,
    // //       },
    // //     },
    // //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [HealthController],
})
export class AppModule {}
