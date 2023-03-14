import { Query, Resolver } from "@nestjs/graphql";
import { UsersService } from "./users.service";
import { User } from "./users.entity";



@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    ) {}

    @Query(() => [User], { name: 'user' })
    displayAll() {
      return this.usersService.displayAll();
    }

}
