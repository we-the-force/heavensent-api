module.exports = ({env}) => ({
    email: {
        provider: 'sendgrid',
        providerOptions: {
            apiKey: env('SENDGRID_API_KEY'),
        },
        settings: {
            defaultFrom: 'erfamel@gmail.com',
            defaultReplyTo: 'erfamel@gmail.com',
        },
    },
});