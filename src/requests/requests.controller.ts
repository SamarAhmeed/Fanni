import { Controller, Get, Post, Query, Body, Req, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { Requests } from './schemas/requests.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateRequestDto } from './dto/createrequest.dto';
import { AuthGuard } from '@nestjs/passport';
import { UpdateRequestDto } from './dto/updaterequest.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('requests')
@UseGuards(AuthGuard())
@ApiTags('Requests')
export class RequestsController {


    constructor(private requestsService: RequestsService) {}


    @ApiOperation({ summary: 'Gets all requests based on logedin user' })
    @Get()
    async getAllRequests(
        @Query() 
        query: ExpressQuery,
        @Req() req,
        ): Promise<Requests[]> {
        return this.requestsService.findAll(query, req.user);
      }

    @ApiOperation({ summary: 'Creates new request for logedin user' })
    @Post()
    async createRequest(
        @Body()
        request: CreateRequestDto,
        @Req() req,
    ): Promise<Requests> {
        return this.requestsService.create(request, req.user);
    }

    @ApiOperation({ summary: 'Gets the request for given id' })
    @Get(':id')
    async getRequest( 
        @Param('id') id: string,
        @Req() req,
        ): Promise<Requests>{
        return this.requestsService.findById(id, req.user);
    }

    @ApiOperation({ summary: 'Updates the request for given id' })
    @Put(':id')
    async updateRequest( 
        @Param('id') id: string,
        @Body() request: UpdateRequestDto,
        @Req() req,
        ): Promise<Requests>{
        return this.requestsService.updateById(id, request, req.user);
    }

    @ApiOperation({ summary: 'Deletes the request for given id' })
    @Delete(':id')
    async deleteRequest(
        @Param('id') id: string,
        @Req() req,
    ): Promise<Requests>{
        return this.requestsService.deleteById(id, req.user);
    }

}
