import {Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";
import { User } from "src/auth/schemas/user.schema";
import { Workers } from "src/worker/schemas/worker.schema";



@Schema({
    timestamps: true
})

export class Requests{
    @Prop()
    field: string;

    @Prop()
    status: string;

    @Prop()
    total: number;

    @Prop()
    city: string;

    @Prop()
    cancellationReason: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Workers'})
    appliedWorkersDetails: Workers;

}

export const RequestsSchema = SchemaFactory.createForClass(Requests); 