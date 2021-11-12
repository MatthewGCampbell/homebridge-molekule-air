// Or, using CommonJS modules
require('cross-fetch/polyfill');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// Import AWS
var AWS = require('aws-sdk/global');

var authenticationData = {
	Username: 'Username',
	Password: 'password',
};
var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
	authenticationData
);
var poolData = {
	UserPoolId: 'us-west-2_KqrEZKC6r', // Your user pool id here
	ClientId: '1ec4fa3oriciupg94ugoi84kkk', // Your client id here
};
var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
var userData = {
	Username: 'username',
	Pool: userPool,
};
var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
cognitoUser.authenticateUser(authenticationDetails, {
	onSuccess: function(result) {
		var accessToken = result.getAccessToken().getJwtToken();

		//POTENTIAL: Region needs to be set if not already set previously elsewhere.
		AWS.config.region = 'us-west-2';

		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: 'us-east-1:56c743d3-310d-4a0e-bf93-6fb7e8c9aad5', // your identity pool id here
			Logins: {
				// Change the key below according to the specific region your user pool is in.
				'cognito-idp.us-west-2.amazonaws.com/us-west-2_KqrEZKC6r': result
					.getIdToken()
					.getJwtToken(),
			},
		});

		//refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
		AWS.config.credentials.refresh(error => {
			if (error) {
				console.error(error);
			} else {
				// Instantiate aws sdk service objects now that the credentials have been updated.
				// example: var s3 = new AWS.S3();
				console.log('Successfully logged!');
			}
		});
	},
	onFailure: function(err) {
		console.log(err.message || JSON.stringify(err));
	},
});
