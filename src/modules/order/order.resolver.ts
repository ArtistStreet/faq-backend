import { Mutation, Resolver } from '@nestjs/graphql';
import { OrderEntity } from 'src/entities/order.entity';
import { OrderService } from './order.service';
import { UseGuards } from '@nestjs/common';
import { UserEntity } from 'src/entities/user.entity';
import { AuthUser } from '../auth/auth.decorator';
import { GqlJwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Resolver(() => OrderEntity)
@UseGuards(GqlJwtAuthGuard)
export class OrderResolver {
     constructor(
          private readonly orderService: OrderService
     ) { }

     @Mutation(() => OrderEntity)
     @UseGuards(GqlJwtAuthGuard)
     async checkout(@AuthUser() auth: UserEntity) {
          return this.orderService.checkout(auth)
     }
}
