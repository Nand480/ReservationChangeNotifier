exports.handler = function(event, context) {
    console.log(JSON.stringify(event, null, 2));
    const streamRecords = event.Records;
    streamRecords.forEach(function(record) {
        if (record.eventName === "MODIFY") {
          const oldData = record.dynamodb.OldImage
          const newData = record.dynamodb.NewImage
          const oldStatus = oldData.status.S
          const newStatus = newData.status.S
          // Load the AWS SDK for Node.js
          var AWS = require('aws-sdk');

          // Create publish parameters
          var params = {
            Message: `Reservation status changed from ${oldStatus} to ${newStatus}`, 
            Subject: "Reservation Update Notification",
            TopicArn: 'arn:aws:sns:us-west-2:932987081118:ReservationNotification'
          };
          
          console.log(`Publising record: ${JSON.stringify(params)}`)
          // Create promise and SNS service object
          new AWS.SNS().publish(params, context.done);
        }
    });
};
