import { Controller, Get, Post, Query, Body, Req, UseGuards, Param, Put, Delete } from '@nestjs/common';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { AuthGuard } from '@nestjs/passport';
import * as tf from '@tensorflow/tfjs';
import { fromJSON, setBackend, DecisionTreeClassifier, trainTestSplit } from 'scikitjs';
import { promises } from 'fs';
import { RequestsCancellationPredictorService } from './requests-cancellation-predictor.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

setBackend(tf)
enum Labels {
    MayBeDone = 0,
    MayBeCanceled = 1,
    MayBeCanceled_CustomerAskedForPostpone = 2,
    MayBeCanceled_feelThePriceOfTheApplicationIsHigh = 3,
    MayBeCanceled_theTechnicalPriceHigherThanTheApplication = 4,
    MayBeCanceled_LocationIsTooFar = 5
  };

@Controller('requests-cancellation-predictor')
// @UseGuards(AuthGuard())
@ApiTags('RequestsCancellationPredictor')
export class RequestsCancellationPredictorController {

    constructor(private requestsPredictorService: RequestsCancellationPredictorService) {}
    
    calculateAccuracy(predictions: number[], actual: number[]): number {
        if (predictions.length !== actual.length) {
          throw new Error('Input arrays must have the same length');
        }
      
        let correctPredictions = 0;
        for (let i = 0; i < predictions.length; i++) {
          if (predictions[i] === actual[i]) {
            correctPredictions++;
          }
        }
      
        return correctPredictions / predictions.length;
      }

    @ApiOperation({ summary: 'Used for Train the Meachine Learning model' })
    @Get('/train')
    async getCancellationTrainModel(
        @Query() 
        query: ExpressQuery,
        @Req() req,
        ): Promise<string> {
            // get requets from database
            // sending query for pagination only. 
            const requests = await this.requestsPredictorService.findAll(query);            
            
            // X is features' attributes
            // [totalcost, hasPostpone, averageRating, distanceFromRequestLocation]
            let X = [];
            
            // y is labeled class
            let y =[];

            // collecting features from the requests.
            for(let i = 0; i<requests.length; i++){
                const request = requests[i].toObject();
                if (request.status != 'reviewed' && request.status != 'done' && request.status != 'canceled')continue;
                if (! request?.appliedWorkersDetails?.length)continue;
                
                let hasPostpone = 0;
                for (let j=0; j<request.statuses.length; j++){
                    if (request.statuses[j].status == 'postponed'){
                        hasPostpone = 1;
                        break;
                    }
                }
                for (let j=0; j<request.appliedWorkersDetails.length; j++){
                    let averageRating = 0;
                    let distanceFromRequestLocation = 0;
                    
                    if (request.appliedWorkersDetails[j].averageRating) 
                        averageRating = request.appliedWorkersDetails[j].averageRating;
                    if (request.appliedWorkersDetails[j].distanceFromRequestLocation)
                        distanceFromRequestLocation = request.appliedWorkersDetails[j].distanceFromRequestLocation;
                    
                    let features = [request.total, hasPostpone, averageRating,distanceFromRequestLocation];
                    X.push(features);

                    if (request.status == 'reviewed' || request.status == 'done')
                        y.push(Labels.MayBeDone);
                    else{
                        if (request.cancellationReason == 'CustomerAskedForPostpone')
                            y.push(Labels.MayBeCanceled_CustomerAskedForPostpone);
                        else if (request.cancellationReason == 'feelThePriceOfTheApplicationIsHigh')
                            y.push(Labels.MayBeCanceled_feelThePriceOfTheApplicationIsHigh);
                        
                        else if (request.cancellationReason == 'theTechnicalPriceHigherThanTheApplication')
                            y.push(Labels.MayBeCanceled_theTechnicalPriceHigherThanTheApplication);
                            
                        else if (request.cancellationReason == 'LocationIsTooFar')
                            y.push(Labels.MayBeCanceled_LocationIsTooFar);
                        
                        else
                            y.push(Labels.MayBeCanceled)
                    }
                }
            }
            
            // split the data into train and test
            let [XTrain, XTest, yTrain, yTest] = trainTestSplit(X, y, 0.4)

            // building the model
            const clf = new DecisionTreeClassifier({ criterion: 'gini', maxDepth: 4 })
            await clf.fit(XTrain, yTrain)
            
            // save the model as json file
            const clf2 = await clf.toJSON();
            let mlModel= JSON.stringify(clf2);
            await promises.writeFile('./mlModel.json', mlModel);

            // test and caculate the accuracy
            let yPredict = clf.predict(XTest);
            let accuracy = this.calculateAccuracy(yPredict, yTest)
            
            return 'The Accuracy of the Test is '+(accuracy * 100).toString()+'%';
    }


    @ApiOperation({ summary: 'Used for Predict the cancelation status for given request id' })
    @Get('/predict/:id')
    async getCancellationPrediction(
        @Param('id') id: string,
        ): Promise<string> {
            
        
            // get the request with given id from database
            let request = await this.requestsPredictorService.findById(id);
            request = request.toObject();

            // collecting features from the request.
            let hasPostpone = 0;
            for (let i = 0; i<request.statuses.length; i++){
                if (request.statuses[i].status == 'postponed'){
                    hasPostpone = 1;
                    break;
                }
            }
            let averageRating = 0;
            let distanceFromRequestLocation = 0;
            if (request?.appliedWorkersDetails?.length){
                if (request.appliedWorkersDetails[0].averageRating) 
                    averageRating = request.appliedWorkersDetails[0].averageRating;
                if (request.appliedWorkersDetails[0].distanceFromRequestLocation)
                    distanceFromRequestLocation = request.appliedWorkersDetails[0].distanceFromRequestLocation;
            }
            let X = [[request.total, hasPostpone, averageRating, distanceFromRequestLocation]];
            
            try{
            // load the saved model
                const model = await promises.readFile('./mlModel.json');
                const modelJson = JSON.parse(model.toString());
                const clf = await fromJSON(modelJson);
                
                // make the prediction
                let requestPrediction = clf.predict(X);

                return Labels[requestPrediction];
            }
            catch (e){
                return 'There is an issue in opening the Model file';
            }
            
    }
}
