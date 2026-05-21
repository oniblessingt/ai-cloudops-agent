exports.handler = async function(event) {
  console.log('Incoming event:', JSON.stringify(event));

  const incident = {
    incidentId: `incident-${Date.now()}`,
    source: event.source || 'unknown',
    severity: 'HIGH',
    recommendation: 'Review CloudWatch metrics and associated operational runbooks.',
    timestamp: new Date().toISOString()
  };

  console.log('Generated incident summary:', JSON.stringify(incident));

  return {
    statusCode: 200,
    body: JSON.stringify(incident)
  };
};
