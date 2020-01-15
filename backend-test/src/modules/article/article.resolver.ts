import {
  Resolver,
  Query,
  Context,
  Mutation,
  Args,
} from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../../common/guard/auth.guard'
import { getMongoManager } from 'typeorm'
import { ArticleEntity } from '../../entities/article.entity'
import { Article } from '../../graphql.schema'

@Resolver()
@UseGuards(GqlAuthGuard)
export class PostResolver {
  @Query()
  async articles(@Context() context): Promise<Article[]>{
    const articleList = await getMongoManager().find(ArticleEntity, {})
    return articleList
  }

  @Mutation()
  async addArticle(@Context() Context, @Args('article') article) {
    const { content, time } = article
    const newPost = new ArticleEntity({content, time})
    const savedResult = await getMongoManager().save(ArticleEntity, newPost)
    return savedResult
  }
}
