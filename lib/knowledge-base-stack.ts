import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as oss from 'aws-cdk-lib/aws-opensearchserverless';
import * as bedrock from 'aws-cdk-lib/aws-bedrock';

export class KnowledgeBaseStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const runbookBucket = new s3.Bucket(this, 'KnowledgeBaseRunbookBucket', {
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    });

    new s3deploy.BucketDeployment(this, 'DeployRunbooks', {
      sources: [s3deploy.Source.asset('runbooks')],
      destinationBucket: runbookBucket,
    });

    const collectionName = 'ai-cloudops-vector-store';

    const encryptionPolicy = new oss.CfnSecurityPolicy(this, 'VectorEncryptionPolicy', {
      name: 'ai-cloudops-vector-encryption',
      type: 'encryption',
      policy: JSON.stringify({
        Rules: [{ ResourceType: 'collection', Resource: [`collection/${collectionName}`] }],
        AWSOwnedKey: true,
      }),
    });

    const networkPolicy = new oss.CfnSecurityPolicy(this, 'VectorNetworkPolicy', {
      name: 'ai-cloudops-vector-network',
      type: 'network',
      policy: JSON.stringify([{ Rules: [{ ResourceType: 'collection', Resource: [`collection/${collectionName}`] }], AllowFromPublic: true }]),
    });

    const collection = new oss.CfnCollection(this, 'VectorCollection', {
      name: collectionName,
      type: 'VECTORSEARCH',
    });
    collection.addDependency(encryptionPolicy);
    collection.addDependency(networkPolicy);

    const kbRole = new iam.Role(this, 'KnowledgeBaseRole', {
      assumedBy: new iam.ServicePrincipal('bedrock.amazonaws.com'),
    });

    runbookBucket.grantRead(kbRole);
    kbRole.addToPolicy(new iam.PolicyStatement({
      actions: ['bedrock:InvokeModel'],
      resources: ['*'],
    }));
    kbRole.addToPolicy(new iam.PolicyStatement({
      actions: ['aoss:APIAccessAll'],
      resources: [collection.attrArn],
    }));

    const knowledgeBase = new bedrock.CfnKnowledgeBase(this, 'CloudOpsKnowledgeBase', {
      name: 'ai-cloudops-runbook-kb',
      roleArn: kbRole.roleArn,
      knowledgeBaseConfiguration: {
        type: 'VECTOR',
        vectorKnowledgeBaseConfiguration: {
          embeddingModelArn: `arn:aws:bedrock:${this.region}::foundation-model/amazon.titan-embed-text-v2:0`,
        },
      },
      storageConfiguration: {
        type: 'OPENSEARCH_SERVERLESS',
        opensearchServerlessConfiguration: {
          collectionArn: collection.attrArn,
          vectorIndexName: 'cloudops-index',
          fieldMapping: {
            vectorField: 'vector',
            textField: 'text',
            metadataField: 'metadata',
          },
        },
      },
    });

    new bedrock.CfnDataSource(this, 'RunbookDataSource', {
      name: 'ai-cloudops-runbook-source',
      knowledgeBaseId: knowledgeBase.attrKnowledgeBaseId,
      dataSourceConfiguration: {
        type: 'S3',
        s3Configuration: {
          bucketArn: runbookBucket.bucketArn,
        },
      },
    });

    new cdk.CfnOutput(this, 'KnowledgeBaseId', { value: knowledgeBase.attrKnowledgeBaseId });
  }
}
