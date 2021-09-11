import * as cdk from '@aws-cdk/core';
import * as  iam from '@aws-cdk/aws-iam';
import * as lambda from "@aws-cdk/aws-lambda";
import * as apigateway from "@aws-cdk/aws-apigateway";
import { IdentitySource } from '@aws-cdk/aws-apigateway';

export class ApigwLambdaAuthorizerAwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const filterLogEvents = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ['arn:aws:logs:*:*:log-group:/aws/lambda/*'],
          actions: ['logs:*'],
          effect: iam.Effect.ALLOW,
        }),
      ],
    });
 


    const role = new iam.Role(this, 'main-lambda-iam-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'An IAM role for main lambda function',
      inlinePolicies: {
        FilterLogEvents: filterLogEvents,
      },
    });
  
    const mainhandler = new lambda.Function(this, "MainHandler", {
      runtime: lambda.Runtime.NODEJS_14_X, 
      code: lambda.Code.fromAsset("mainLambda"),
      handler: "index.main",
      role: role,
      functionName: "main-function"
     
    });

    const authorizerhandler = new lambda.Function(this, "AuthorizerHandler", {
      runtime: lambda.Runtime.NODEJS_14_X, 
      code: lambda.Code.fromAsset("authorizerLambda"),
      handler: "index.main",
      functionName: "authorizer-function",
      role: role,     
    });

    

    const api = new apigateway.RestApi(this, "lambda-authorizer-test", {
      restApiName: "lambda-authorizer-test",
      description: "This API to test lambda authorizer."
    });

     const auth = new apigateway.RequestAuthorizer(this, 'lambdaAuthorizer', {
      handler: authorizerhandler,
      identitySources: [IdentitySource.header('Authorization')]
    }); 

    const lambdaIntegration = new apigateway.LambdaIntegration(mainhandler, {
      requestTemplates: { "application/json": '{ "statusCode": "200" }' }
    });

    api.root.addMethod("GET", lambdaIntegration,{
      authorizer: auth
    });

  }
}
