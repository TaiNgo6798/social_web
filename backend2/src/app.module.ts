import { CatsModule } from './cats/cats.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';



@Module({
  imports: [
    CatsModule,
    GraphQLModule.forRoot({
    autoSchemaFile: 'schema.gql',
  }),
  MongooseModule.forRoot('mongodb://localhost/nest'),
  UserModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
