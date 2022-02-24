import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

import 'dotenv/config';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ni2kw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    ),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      subscriptions: {
        'graphql-ws': true,
      },
      cors: {
        credentials: true,
        origin: true,
      },
      context: ({ req, res }) => ({ req, res }),
    }),
    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
