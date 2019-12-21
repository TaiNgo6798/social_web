import { UserInput } from './inputs/user.input';
import { UserType } from './dto/user_dto';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { LoginInput } from './inputs/login.input';

@Resolver('User')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => [UserType])
  async users() {
    return this.userService.findAll();
  }

  @Mutation(() => String)
  async login(@Args('input') input: LoginInput) {
    return this.userService.login(input);
  }

  @Mutation(() => UserType)
  async createUser(@Args('input') input: UserInput) {
    return this.userService.create(input);
  }

}
