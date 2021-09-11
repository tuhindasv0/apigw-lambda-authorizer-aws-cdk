import * as cdk from '@aws-cdk/core';
import * as  iam from '@aws-cdk/aws-iam';
import * as lambda from "@aws-cdk/aws-lambda";

export class ApigwLambdaAuthorizerAwsCdkStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const filterLogEvents = new iam.PolicyDocument({
      statements: [
        new iam.PolicyStatement({
          resources: ['arn:aws:logs:*:*:log-group:/aws/lambda/*'],
          actions: ['logs:FilterLogEvents'],
          effect: iam.Effect.ALLOW,
        }),
      ],
    });
 


    const role = new iam.Role(this, 'example-iam-role', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description: 'An example IAM role in AWS CDK',
      inlinePolicies: {
        FilterLogEvents: filterLogEvents,
      },
    });
  
    const handler = new lambda.Function(this, "MainHandler", {
      runtime: lambda.Runtime.NODEJS_14_X, 
      code: lambda.Code.fromAsset("mainLambda"),
      handler: "index.main",
      role: role,
     
    });
  }
}
