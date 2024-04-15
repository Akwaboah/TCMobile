import {
  MOBILE_AUTH_URL
} from '@env';

export const appConfig = () => ({
  client: {
    ikanet: {
      authUrl: MOBILE_AUTH_URL,
    },
  },
  storageKey: {
    userModel: '@UserModel',
    authenticationModel: '@AuthenticationModel',
  },
});