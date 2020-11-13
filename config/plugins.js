module.exports = ({env}) => (
    console.log("ayyy\r\n", process.env.SENDGRID_API_KEY),
    {
        email: {
            provider: 'sendgrid',
            providerOptions: {
                apiKey: process.env.SENDGRID_API_KEY,
            },
            settings: {
                
                defaultFrom: 'will@wetheforce.com',
                defaultReplyTo: 'will@wetheforce.com',
            },
        },
    }
);