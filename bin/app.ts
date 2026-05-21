import * as cdk from 'aws-cdk-lib';
import { AgentStack } from '../lib/agent-stack';

const app = new cdk.App();

new AgentStack(app, 'AiCloudOpsAgentStack', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});
