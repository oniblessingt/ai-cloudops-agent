exports.handler = async function(event) {
  console.log('Cost optimization request received');

  return {
    recommendations: [
      'Reduce CloudWatch log retention',
      'Right-size ECS services',
      'Review idle RDS instances',
      'Enable Bedrock token budget alerts'
    ],
    analyzedAt: new Date().toISOString()
  };
};
