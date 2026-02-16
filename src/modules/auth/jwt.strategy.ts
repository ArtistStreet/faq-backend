import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { AuthService } from "./auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
     constructor(
          private readonly userService: AuthService,
     ) {
          super({
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
               secretOrKey: process.env.JWT_SECRET || 'secret_key',
          });
     }

     async validate(payload: any) {
          const user = await this.userService.findOne(payload.sub);
          return user;
     }
}
