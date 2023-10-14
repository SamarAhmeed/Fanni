import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerModule } from './worker/worker.module';
import { RequestsModule } from './requests/requests.module';
import { RequestsCancellationPredictorModule } from './requests-cancellation-predictor/requests-cancellation-predictor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.DB_URI),
    AuthModule,
    WorkerModule,
    RequestsModule,
    RequestsCancellationPredictorModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
