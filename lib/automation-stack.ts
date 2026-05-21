import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as stepfunctions from 'aws-cdk-lib/aws-stepfunctions';
import * as tasks from 'aws-cdk-lib/aws-stepfunctions-tasks';

export class AutomationStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const approvalLambda = new lambda.Function(this, 'ApprovalLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('lambda/approval-handler'),
    });

    const remediationLambda = new lambda.Function(this, 'RemediationLambda', {
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'handler.handler',
      code: lambda.Code.fromAsset('lambda/remediation-handler'),
    });

    const approvalTask = new tasks.LambdaInvoke(this, 'ApprovalTask', {
      lambdaFunction: approvalLambda,
      outputPath: '$.Payload',
    });

    const remediationTask = new tasks.LambdaInvoke(this, 'RemediationTask', {
      lambdaFunction: remediationLambda,
      outputPath: '$.Payload',
    });

    const workflow = new stepfunctions.StateMachine(this, 'ApprovalWorkflow', {
      definition: approvalTask.next(remediationTask),
    });

    new cdk.CfnOutput(this, 'WorkflowArn', {
      value: workflow.stateMachineArn,
    });
  }
}
