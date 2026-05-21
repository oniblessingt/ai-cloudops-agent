# AWS Native AI CloudOps Agent

This repository contains an end-to-end AWS CDK project for an AI CloudOps Agent using AWS-native services only.

The solution receives operational, security, and cost events, analyzes them with Amazon Bedrock, retrieves runbook context through a Knowledge Base pattern, calls AWS Lambda tools for operational data, stores incident analysis in DynamoDB, sends notifications through SNS, and routes remediation through Step Functions for human approval.

## What this project demonstrates

- AI agent architecture on AWS
- Amazon Bedrock agent/tooling pattern
- RAG-ready runbook knowledge base structure
- CloudWatch, GuardDuty, Security Hub, Cost Explorer integration pattern
- EventBridge-driven automation
- Step Functions approval workflow
- DynamoDB incident tracking
- CloudWatch dashboard and alarms
- AWS Budgets for cost control
- CDK-first infrastructure delivery

## Architecture

```text
CloudWatch / GuardDuty / Security Hub / Cost Signals
        |
     EventBridge
        |
 Alert Processor Lambda
        |
 AI CloudOps Agent Logic
   |        |        |
Runbooks  AWS Tools  Approval Workflow
   |        |        |
 S3       Lambda     Step Functions
        |
DynamoDB + SNS + CloudWatch Dashboard
```

## Project structure

```text
bin/                  CDK app entry point
lib/                  CDK infrastructure stacks
lambda/               AWS Lambda tool handlers
runbooks/             Operational and security runbooks
.github/workflows/    CI validation workflow
```

## Setup

```bash
npm install
npm run build
npx cdk synth
```

## Bootstrap AWS account

```bash
npx cdk bootstrap aws://ACCOUNT_ID/us-east-1
```

## Deploy

```bash
npx cdk deploy --all
```

## Important production notes

This repo is CDK-first. Do not manually create cloud resources in the AWS console. Review IAM permissions before production use and scope policies to approved accounts, regions, resources, and environments.
