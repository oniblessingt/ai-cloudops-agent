import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';

export class AgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const runbookBucket = new s3.Bucket(this, 'RunbookBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    const incidentTable = new dynamodb.Table(this, 'IncidentTable', {
      partitionKey: {
        name: 'incidentId',
        type: dynamodb.AttributeType.STRING,
      },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      encryption: dynamodb.TableEncryption.AWS_MANAGED,
    });

    const notificationTopic = new sns.Topic(this, 'IncidentTopic');

    const alertProcessor = new lambda.Function(this, 'AlertProcessor', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('lambda/alert-processor'),
      timeout: cdk.Duration.seconds(30),
      environment: {
        INCIDENT_TABLE: incidentTable.tableName,
        TOPIC_ARN: notificationTopic.topicArn,
      },
    });

    incidentTable.grantWriteData(alertProcessor);
    notificationTopic.grantPublish(alertProcessor);

    new cloudwatch.Dashboard(this, 'CloudOpsDashboard', {
      dashboardName: 'ai-cloudops-dashboard',
    });

    new cdk.CfnOutput(this, 'RunbookBucketName', {
      value: runbookBucket.bucketName,
    });
  }
}
