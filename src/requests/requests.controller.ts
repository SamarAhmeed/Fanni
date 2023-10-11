import { Controller, Get, Post, Query, Body, Req, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests } from './schemas/requests.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateRequestDto } from './dto/createrequest.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRequestDto } from './dto/updaterequest.dto';

@Controller('requests')
@UseGuards(AuthGuard())
export class RequestsController {


    constructor(private requestsService: RequestsService) {}


    @Get()
    async getAllRequests(
        @Query() 
        query: ExpressQuery,
        @Req() req,
        ): Promise<Requests[]> {
        return this.requestsService.findAll(query, req.user);
      }

    @Post()
    async createRequest(
        @Body()
        request: CreateRequestDto,
        @Req() req,
    ): Promise<Requests> {
        return this.requestsService.create(request, req.user);
    }

    @Get(':id')
    async getRequest( 
        @Param('id') id: string
        ): Promise<Requests>{
        return this.requestsService.findById(id);
    }

    @Put(':id')
    async updateRequest( 
        @Param('id') id: string,
        @Body() request: UpdateRequestDto,
        ): Promise<Requests>{
        return this.requestsService.updateById(id, request);
    }

    @Delete(':id')
    async deleteRequest(
        @Param('id') id: string,
    ): Promise<Requests>{
        return this.requestsService.deleteById(id);
    }

}
