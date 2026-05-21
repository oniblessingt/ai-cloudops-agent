# Security Incident Response Runbook

## Initial Actions

1. Validate the GuardDuty or Security Hub finding.
2. Identify affected resources.
3. Review IAM activity and CloudTrail events.
4. Assess business impact.
5. Escalate based on severity.

## Containment

- Restrict risky security group access.
- Disable exposed credentials.
- Isolate compromised workloads.

## Recovery

- Restore from approved infrastructure state.
- Validate application health.
- Review logs and metrics.

## Post Incident

- Document lessons learned.
- Update monitoring rules.
- Update runbooks and automation.
