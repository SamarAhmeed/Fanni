import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { RequestsPredictor } from './schema/requests_predictor.schema';

@Injectable()
export class RequestsCancellationPredictorService {

    constructor(
        @InjectModel('Requests')
        private requestsPredictorModel: mongoose.Model<RequestsPredictor>,
      ) {}


    async findAll(query: Query): Promise<RequestsPredictor[]> {
        
        const resPerPage = Number(query.pageSize) || 5000;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
      
        const requests = await this.requestsPredictorModel
        .find()
        .limit(resPerPage)
        .skip(skip);

        return requests;
        
    }

    async findById(id: string): Promise<RequestsPredictor> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Please enter correct id.');
        }

        const request = (await this.requestsPredictorModel.findById(id));

        if (!request) {
            throw new NotFoundException('Request not found.');
        }

        return request;
    }
    
}
