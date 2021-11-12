import AWS from 'aws-sdk';
import {
  CognitoUserPool,
  AuthenticationDetails,
  CognitoUser,
} from 'amazon-cognito-identity-js';

// Setup Login Information
const email = 'EMAIL';
const pass = 'PASSWORD';
const ClientId = '1ec4fa3oriciupg94ugoi84kkk';
const PoolId = 'us-west-2_KqrEZKC6r';

AWS.config.update({
  region: 'us-west-2',
});

const authenticationData = {
  Username: email,
  Password: pass,
};

const userPoolData = {
  UserPoolId: PoolId,
  ClientId: ClientId,
};

const userPool = new CognitoUserPool(userPoolData);

const userData = {
  Username: email,
  Pool: userPool,
};

const authenticationDetails = new AuthenticationDetails(authenticationData);
const cognitoUser = new CognitoUser(userData);

export function initiateAuth() {
  cognitoUser.authenticateUser(authenticationDetails, {
    onSuccess: (result) => {
      return result.getAccessToken().getJwtToken();
    },
    onFailure: (err) => {
      return err;
    },
  });
}

