import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsSchema } from './schemas/requests.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Requests', schema: RequestsSchema }]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService]
})
export class RequestsModule {}
