import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserEntity } from '../../entities/user.entity';

// Dùng cho cả REST và GraphQL
export const AuthUser = createParamDecorator((_: unknown, context: ExecutionContext): UserEntity => {
    const request = getRequest(context);

    if (!request?.user) {
        throw new UnauthorizedException('User not authenticated');
    }

    return request.user;
});

function getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
        return context.switchToHttp().getRequest(); // REST
    }
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req; // GraphQL
}
