import { Controller, UseGuards, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { AuthGuard } from '@nestjs/passport';
import { Workers } from './schemas/worker.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('worker')
@UseGuards(AuthGuard())
@ApiTags('Worker')
export class WorkerController {

    constructor(private workerService: WorkerService) {}
    @ApiOperation({ summary: 'Gets all workers' })
    @Get()
    async getAllWorkers(
        @Query() 
        query: ExpressQuery,
        ): Promise<Workers[]> {
        return this.workerService.findAll(query);
      }

    @ApiOperation({ summary: 'Creates new worker' })
    @Post()
    async createWorker(
        @Body()
        worker: CreateWorkerDto,
    ): Promise<Workers> {
        return this.workerService.create(worker);
    }

    @ApiOperation({ summary: 'Gets worker by id' })
    @Get(':id')
    async getRequest( 
        @Param('id') id: string
        ): Promise<Workers>{
        return this.workerService.findById(id);
    }

    @ApiOperation({ summary: 'Updates the worker for given id' })
    @Put(':id')
    async updateRequest( 
        @Param('id') id: string,
        @Body() worker: UpdateWorkerDto,
        ): Promise<Workers>{
        return this.workerService.updateById(id, worker);
    }

    @ApiOperation({ summary: 'Deletes the worker for given id' })
    @Delete(':id')
    async deleteRequest(
        @Param('id') id: string,
    ): Promise<Workers>{
        return this.workerService.deleteById(id);
    }

}
