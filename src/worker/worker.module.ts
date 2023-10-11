import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { WorkerService } from './worker.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerSchema } from './schemas/worker.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Workers', schema: WorkerSchema }]),
  ],
  controllers: [WorkerController],
  providers: [WorkerService]
})
export class WorkerModule {}
