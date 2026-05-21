import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as lambda from 'aws-cdk-lib/aws-lambda';

export class EventBridgeStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const processor = new lambda.Function(this, 'EventProcessor', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('lambda/event-processor'),
    });

    const rule = new events.Rule(this, 'CloudOpsRule', {
      eventPattern: {
        source: [
          'aws.cloudwatch',
          'aws.guardduty',
          'aws.securityhub',
          'aws.config'
        ]
      }
    });

    rule.addTarget(new targets.LambdaFunction(processor));
  }
}
