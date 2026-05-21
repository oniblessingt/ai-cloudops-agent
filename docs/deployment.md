# Deployment Guide

## Prerequisites

- AWS CLI configured
- Node.js 20+
- AWS CDK installed
- AWS account bootstrapped

## Install Dependencies

```bash
npm install
```

## Bootstrap

```bash
npx cdk bootstrap aws://ACCOUNT_ID/us-east-1
```

## Build

```bash
npm run build
```

## Synthesize CloudFormation

```bash
npx cdk synth
```

## Deploy

```bash
npx cdk deploy --all
```

## Validate

- Verify Lambda creation
- Verify EventBridge rules
- Verify CloudWatch dashboard
- Verify Step Functions workflow
- Verify DynamoDB incident table
- Verify SNS topic

## Cleanup

```bash
npx cdk destroy --all
```
