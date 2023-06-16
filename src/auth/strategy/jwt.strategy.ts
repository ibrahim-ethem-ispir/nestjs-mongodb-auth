import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import * as mongoose from "mongoose";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Token, TokenSchema } from "../schemas";
import { IJwtPayload } from "../interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor (
        @InjectModel("Token") private readonly tokenModel: mongoose.Model<TokenSchema>
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET_KEY
        })
    }

    async validate(payload: IJwtPayload): Promise<Token> {
        const userId = new mongoose.Types.ObjectId(payload.userId)

        const token = await this.tokenModel.findOne({userId}).select("-_id userId")

        console.log(" ******* token : ", token)

        if (!token) throw new UnauthorizedException()

        return token
    }

}