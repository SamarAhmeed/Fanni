import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Requests } from './schemas/requests.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';
import { User } from 'src/auth/schemas/user.schema';


@Injectable()
export class RequestsService {

    constructor(
        @InjectModel(Requests.name)
        private requestsModel: mongoose.Model<Requests>,
      ) {}

    async findAll(query: Query, user: User): Promise<Requests[]> {
    const resPerPage = 2;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    query["user"] = user._id;

    const requests = await this.requestsModel
    .find({ ...query })
    .limit(resPerPage)
    .skip(skip);

    return requests;

    }
    
    async create(request: Requests, user: User): Promise<Requests> {
        const data = Object.assign(request, { user: user._id });
    
        const res = await this.requestsModel.create(data);
        return res;
      }
    
    async findById(id: string): Promise<Requests> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Please enter correct id.');
        }

        const request = await this.requestsModel.findById(id);

        if (!request) {
            throw new NotFoundException('Request not found.');
        }

        return request;
    }
    
    async updateById(id:string, request: Requests): Promise<Requests>{
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Please enter correct id.');
        }
        return await this.requestsModel.findByIdAndUpdate(id, request, {
            new: true,
            runValidators: true,
          });
    }

    async deleteById(id:string): Promise<Requests> {
        return await this.requestsModel.findByIdAndDelete(id);
    }

}
