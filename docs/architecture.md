# AI CloudOps Agent Architecture

## Core Flow

```text
AWS Events
  |
EventBridge
  |
Alert Processor Lambda
  |
AI CloudOps Agent
  |-----------------------------|
Knowledge Base             AWS Tool Lambdas
  |                             |
OpenSearch Vector Store    Security + Cost + Ops
  |
Incident Analysis
  |
Step Functions Approval
  |
Remediation Lambda
  |
SNS + CloudWatch + DynamoDB
```

## Services

- Amazon Bedrock
- Bedrock Knowledge Bases
- OpenSearch Serverless
- Lambda
- Step Functions
- EventBridge
- CloudWatch
- DynamoDB
- SNS
- AWS Budgets
- GuardDuty
- Security Hub

## Security Controls

- IAM least privilege
- Encrypted S3 buckets
- DynamoDB encryption
- Approval-based remediation
- CloudTrail logging

## Deployment Strategy

- CDK-first deployment
- Multi-environment configuration
- GitHub Actions validation
- CodePipeline support
