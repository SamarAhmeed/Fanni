import {Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({
    timestamps: true
})

export class Workers{

    @Prop()
    name: string;

    @Prop()
    phone: string;

    @Prop()
    field: string;

    @Prop()
    avgRate: number;

}

export const WorkerSchema = SchemaFactory.createForClass(Workers); 