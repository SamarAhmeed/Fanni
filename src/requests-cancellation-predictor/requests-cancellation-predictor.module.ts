import { Module } from '@nestjs/common';
import { RequestsCancellationPredictorService } from './requests-cancellation-predictor.service';
import { RequestsCancellationPredictorController } from './requests-cancellation-predictor.controller';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { RequestsPredictorSchema } from './schema/requests_predictor.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([{ name: 'Requests', schema: RequestsPredictorSchema }]),
  ],
  providers: [RequestsCancellationPredictorService],
  controllers: [RequestsCancellationPredictorController]
})
export class RequestsCancellationPredictorModule {}
