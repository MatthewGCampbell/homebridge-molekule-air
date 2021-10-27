// Or, using CommonJS modules
require('cross-fetch/polyfill');
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
// Import AWS
import AWS from 'aws-sdk';

import AmazonCognitoIdentity from 'amazon-cognito-identity-js';

var authenticationData = {
	Username: 'username',
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
		AWS.config.region = '<region>';

		AWS.config.credentials = new AWS.CognitoIdentityCredentials({
			IdentityPoolId: '...', // your identity pool id here
			Logins: {
				// Change the key below according to the specific region your user pool is in.
				'cognito-idp.<region>.amazonaws.com/<YOUR_USER_POOL_ID>': result
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
		alert(err.message || JSON.stringify(err));
	},
});
