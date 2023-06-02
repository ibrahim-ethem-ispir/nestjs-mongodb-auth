import mongoose from "mongoose";

export interface IJwtPayload {
    userId: mongoose.Types.ObjectId
}