import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
    const resPerPage = Number(query.pageSize) || 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    // query["user"] = user._id;
    const filter = query.status
    ? {
        status: query.status
      }
    : {};
    const requests = await this.requestsModel
    .find({ ...filter }).populate('appliedWorkersDetails')
    .limit(resPerPage)
    .skip(skip);

    return requests;

    }
    
    async create(request: Requests, user: User): Promise<Requests> {
        const data = Object.assign(request, { user: user._id });
    
        const res = await this.requestsModel.create(data);
        return res;
      }
    
    async findById(id: string, user:User): Promise<Requests> {
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
            throw new BadRequestException('Please enter correct id.');
        }

        const request = (await this.requestsModel.findById(id).populate("appliedWorkersDetails"));

        if (!request) {
            throw new NotFoundException('Request not found.');
        }

        if (! request.user.equals(user._id)){
          throw new NotAcceptableException('You do not have access on this request.');
        }

        return request;
    }
    
    async updateById(id:string, request: Requests, user: User): Promise<Requests>{
        const isValidId = mongoose.isValidObjectId(id);

        if (!isValidId) {
          throw new BadRequestException('Please enter correct id.');
        }

        const request_data = (await this.requestsModel.findById(id));
        if (request_data && ! request_data.user.equals(user._id)){
          throw new NotAcceptableException('You do not have access on this request.');
        }

        return await this.requestsModel.findByIdAndUpdate(id, request, {
            new: true,
            runValidators: true,
          });
    }

    async deleteById(id:string, user: User): Promise<Requests> {
      const request_data = (await this.requestsModel.findById(id));
      if (request_data && ! request_data.user.equals(user._id)){
        throw new NotAcceptableException('You do not have access on this request.');
      }
        return await this.requestsModel.findByIdAndDelete(id);
    }

}
