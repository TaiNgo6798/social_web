import { Injectable, ExecutionContext, CanActivate } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { GqlExecutionContext } from '@nestjs/graphql'
import { Observable } from 'rxjs'
import { UserService } from '../../modules/user/user.service'
import { getMongoManager } from 'typeorm'
import { DishEntity } from '../../entities/dish.entity'

@Injectable()
export class GqlAuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) { }

  async canActivate(
    context: ExecutionContext,
  ) {
    try {
      const gqlCtx = GqlExecutionContext.create(context)
      const { authorization } = gqlCtx.getContext().req.headers
      // TODO: (dành cho các bạn training)
      // Decode để lấy userID trong token được đính kèm với Authorization header
      // Lấy các thông tin khác của userID (permission, profile, ...)
      // Gán các thông tin vừa lấy được gán vào context để có thể truy cập được trong resolver
      console.log(authorization)
      gqlCtx.getContext().user = { username: 'User A', permission: ['FOO', 'BAR'] }
      // nếu không có return false block
      // if (!authorization) return false
    } catch (err) {
      return false
    }
    return true
  }
}
