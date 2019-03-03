export const environment = {
  production: false,
  version: '(dev)',
  defaultLanguage: 'dk-DK',
  supportedLanguages: [
    'en-US',
    'dk-DK'
  ],
  firebase: {
    apiKey: 'AIzaSyAllN2sLx7dZWlItCbrixBmUVNyQbBe3RM',
    authDomain: 'swop-dev.firebaseapp.com',
    databaseURL: 'https://swop-dev.firebaseio.com',
    projectId: 'swop-dev',
    storageBucket: 'swop-dev.appspot.com',
    messagingSenderId: '633902198139'
  },
  stripe: {
    publishableKey: 'pk_test_QEOc1CBdOHasfWIeZJVPzje8',
  },
  functionsURL: 'https://us-central1-swop-dev.cloudfunctions.net'
};
