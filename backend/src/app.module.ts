import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configValidationSchema } from './app.schemas';
import { AuthenticationModule } from './authentication/authentication.module';
import { GameGateway} from "./game/game.gateway";
import {JwtService} from "@nestjs/jwt";
import {AuthenticationService} from "./authentication/authentication.service";
import {UsersService} from "./users/users.service";
import {JwtStrategy} from "./authentication/jwt.strategy";
import { GameModule} from "./game/game.module";
import { ChatsModule } from './chats/chats.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MessagesModule } from './Messages/messages.module';
import { PubSubModule } from './pub-sub/pub-sub.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      installSubscriptionHandlers: true,
      // subscriptions: {
      //   path: '/subscriptions',
      //   keepAlive: 5000,
      // }
    }),
    TypeOrmModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [`stage.${process.env.STAGE}.env`],
          validationSchema: configValidationSchema,
        }),
        UsersModule,
        AuthenticationModule,
        GameModule,

      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: true,
        };
      },
    }),
    ChatsModule,
    MessagesModule,
    PubSubModule,
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}