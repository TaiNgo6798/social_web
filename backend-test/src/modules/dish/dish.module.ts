import { Module } from '@nestjs/common'
import { DishResolvers } from './dish.resolver'
import { UserModule } from '../user/user.module'

@Module({ 
  providers: [DishResolvers], 
  imports: [UserModule] 
})
export class DishModule { }
