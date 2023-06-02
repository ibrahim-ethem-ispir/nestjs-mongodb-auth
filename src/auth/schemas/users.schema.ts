import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type UserSchema = HydratedDocument<User>

@Schema({versionKey: false, timestamps: true })
export class User {
    @Prop({ required: true })
    name: string

    @Prop({required: true})
    surname: string

    @Prop({required: true, unique: true, index: true })
    email: string

    @Prop({required: true})
    password: string
}

export const UserSchema = SchemaFactory.createForClass(User)