import {Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";



@Schema({
    timestamps: true
})

export class Workers{

    @Prop()
    name: string;

    @Prop()
    username: string;

    @Prop()
    field: string;

    @Prop()
    averageRating: number;

    @Prop()
    distanceFromRequestLocation: number;
    
}

export const WorkerSchema = SchemaFactory.createForClass(Workers); 