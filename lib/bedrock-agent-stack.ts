import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

export interface BedrockAgentStackProps extends cdk.StackProps {
  knowledgeBaseId?: string;
}

export class BedrockAgentStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: BedrockAgentStackProps) {
    super(scope, id, props);

    const agentRole = new iam.Role(this, 'BedrockAgentRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
      description: 'Execution role for the AI CloudOps Bedrock Agent',
    });

    agentRole.addToPolicy(new iam.PolicyStatement({
      actions: [
        'bedrock:InvokeModel',
        'bedrock:Retrieve',
        'bedrock:RetrieveAndGenerate'
      ],
      resources: ['*'],
    }));

    const agent = new bedrock.CfnAgent(this, 'AiCloudOpsBedrockAgent', {
      agentName: 'ai-cloudops-agent',
      agentResourceRoleArn: agentRole.roleArn,
      foundationModel: 'anthropic.claude-3-5-sonnet-20240620-v1:0',
      instruction: [
        'You are an AWS CloudOps AI Agent.',
        'Analyze operational, security, and cost signals from AWS services.',
        'Use approved runbook knowledge before recommending action.',
        'Never execute production remediation without human approval.',
        'Return severity, root cause, impact, recommendation, and next action.'
      ].join(' '),
      autoPrepare: true,
    });

    new cdk.CfnOutput(this, 'BedrockAgentId', {
      value: agent.attrAgentId,
    });
  }
}
