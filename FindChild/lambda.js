let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();
exports.handler = function (event, context, callback) {

	var childrenid = Number(event['childrenid']);
	var receiver;
	var sender;
	var message;

	console.log(childrenid);

	ddb.get({
		TableName: 'children',
		Key: { 'id': childrenid }
	}, function (err, data) {
		if (err) {
			console.log(err);
		} else {
			receiver = data.Item['phone'];

			sender = 'LostChildren';

			message = 'Your children is now with me';

			console.log('###########################################################')
			console.log('###########################################################')
			console.log('###########################################################')
			console.log('Receiver: ' + receiver)
			console.log('Sender: ' + sender)
			console.log('Message: ' + message)
			console.log('###########################################################')
			console.log('###########################################################')
			console.log('###########################################################')
			console.log("Sending message", message, "to receiver", receiver);

			sns.publish({
				Message: message,
				MessageAttributes: {
					'AWS.SNS.SMS.SMSType': {
						DataType: 'String',
						StringValue: 'Promotional'
					},
					'AWS.SNS.SMS.SenderID': {
						DataType: 'String',
						StringValue: sender
					},
				},
				PhoneNumber: receiver
			}).promise()
				.then(data => {
					console.log("Sent message to", receiver);
					callback(null, data);
				})
				.catch(err => {
					console.log("Sending failed", err);
					callback(err);
				});
		}
	});





}