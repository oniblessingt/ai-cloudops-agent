exports.handler = async function(event) {
  console.log('Security analysis request received');

  return {
    findingType: 'GuardDuty',
    severity: 'HIGH',
    recommendation: 'Review IAM activity and isolate suspicious resources.',
    analyzedAt: new Date().toISOString()
  };
};
