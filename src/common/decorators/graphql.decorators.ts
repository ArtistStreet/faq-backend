// import { applyDecorators, UseGuards } from '@nestjs/common';
// import { Mutation, Query, Resolver } from '@nestjs/graphql';
// import { ReturnTypeFunc } from '@nestjs/graphql/dist/interfaces/return-type-func.interface';
// import { MutationOptions } from '@nestjs/graphql/dist/decorators/mutation.decorator';
// import { QueryOptions } from '@nestjs/graphql/dist/decorators/query.decorator';
// import { JwtAuthGuard } from '../../modules/auth/jwt-auth.guard';

// export function AuthResolver(model?: Function) {
//     return applyDecorators(model ? Resolver(() => model) : Resolver(), UseGuards(JwtAuthGuard));
// }

// export const AuthQuery = (typeFunc: ReturnTypeFunc, options?: QueryOptions) => {
//     return applyDecorators(UseGuards(JwtAuthGuard), Query(typeFunc, options));
// };
// export const AuthMutation = (typeFunc: ReturnTypeFunc, options?: MutationOptions) => {
//     return applyDecorators(UseGuards(JwtAuthGuard), Mutation(typeFunc, options));
// };
