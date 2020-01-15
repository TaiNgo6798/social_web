import { Module } from '@nestjs/common';
import { PostResolver } from './article.resolver';
import { UserModule } from '../user/user.module';

@Module({
  providers: [PostResolver],
  imports: [UserModule]
})
export class ArticleModule {}
