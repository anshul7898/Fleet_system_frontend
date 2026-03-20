import { Amplify } from 'aws-amplify';

export function configureCognito() {
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
        userPoolClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID,
        region: 'ap-south-1', // Match your User Pool region
      },
    },
  });
}
