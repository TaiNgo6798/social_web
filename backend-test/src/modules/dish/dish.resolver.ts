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
import { DishEntity } from '../../entities/dish.entity'
import { Dish } from '../../graphql.schema'

@Resolver()
@UseGuards(GqlAuthGuard)
export class DishResolvers {
  @Query()
  async dishes(@Context() context): Promise<Dish[]> {
    const foundDishes = await getMongoManager().find(DishEntity, {})
    return foundDishes
  }

  @Mutation()
  async addDish(@Context() context, @Args('dish') dish) {
    const { name } = dish
    const newDish = new DishEntity({ name })
    const savedResult = await getMongoManager().save(DishEntity, newDish)
    return savedResult
  }
}
