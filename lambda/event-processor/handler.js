exports.handler = async function(event) {
  console.log('EventBridge event received');
  console.log(JSON.stringify(event));

  return {
    processed: true,
    processedAt: new Date().toISOString()
  };
};
