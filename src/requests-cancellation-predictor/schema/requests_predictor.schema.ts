import {Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Type } from "class-transformer";
import { Document } from "mongoose";


class statusHistory extends Document{
    status: string;
}

class appliedWorker extends Document{
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
@Schema({
    timestamps: true
})
export class RequestsPredictor extends Document{
    @Prop()
    field: string;

    @Prop()
    status: string;

    @Prop()
    statuses: statusHistory[];

    @Prop()
    total: number;

    @Prop()
    city: string;

    @Prop()
    cancellationReason: string;

    @Prop()
    appliedWorkersDetails: appliedWorker[];
}

export const RequestsPredictorSchema = SchemaFactory.createForClass(RequestsPredictor); 