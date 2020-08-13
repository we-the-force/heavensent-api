module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'gmail-2lo',
    providerOptions: {
      username: 'will@wetheforce.com',
      clientId: env('EMAIL_CLIENT_ID'),
      privateKey: env('EMAIL_PRIVATE_KEY'),
    },
    settings: {
      defaultFrom: 'will@wetheforce.com',
      defaultReplyTo: 'no-reply@wetheforce.com',
    },
  },
  // ...
});