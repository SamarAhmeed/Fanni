import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Workers } from './schemas/worker.schema';
import * as mongoose from 'mongoose';
import { Query } from 'express-serve-static-core';


@Injectable()
export class WorkerService {
    constructor(
        @InjectModel(Workers.name)
        private workerModel: mongoose.Model<Workers>,
      ) {}

    
      async findAll(query: Query): Promise<Workers[]> {
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);
        
        const Workers = await this.workerModel
        .find()
        .limit(resPerPage)
        .skip(skip);
    
        return Workers;
    
        }
        
        async create(worker: Workers): Promise<Workers> {        
            const res = await this.workerModel.create(worker);
            return res;
          }
        
        async findById(id: string): Promise<Workers> {
            const isValidId = mongoose.isValidObjectId(id);
    
            if (!isValidId) {
                throw new BadRequestException('Please enter correct id.');
            }
    
            const worker = await this.workerModel.findById(id);
    
            if (!worker) {
                throw new NotFoundException('worker not found.');
            }
    
            return worker;
        }
        
        async updateById(id:string, worker: Workers): Promise<Workers>{
            const isValidId = mongoose.isValidObjectId(id);
    
            if (!isValidId) {
              throw new BadRequestException('Please enter correct id.');
            }
            return await this.workerModel.findByIdAndUpdate(id, worker, {
                new: true,
                runValidators: true,
              });
        }
    
        async deleteById(id:string): Promise<Workers> {
            return await this.workerModel.findByIdAndDelete(id);
        }
    
}
