import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudwatch from 'aws-cdk-lib/aws-cloudwatch';
import * as budgets from 'aws-cdk-lib/aws-budgets';

export class MonitoringStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dashboard = new cloudwatch.Dashboard(this, 'CloudOpsMonitoringDashboard', {
      dashboardName: 'ai-cloudops-monitoring-dashboard',
    });

    dashboard.addWidgets(
      new cloudwatch.TextWidget({
        markdown: '# AI CloudOps Monitoring Dashboard',
        width: 24,
        height: 2,
      })
    );

    new budgets.CfnBudget(this, 'MonthlyAiBudget', {
      budget: {
        budgetName: 'ai-cloudops-monthly-budget',
        budgetType: 'COST',
        timeUnit: 'MONTHLY',
        budgetLimit: {
          amount: 500,
          unit: 'USD',
        },
      },
    });
  }
}
