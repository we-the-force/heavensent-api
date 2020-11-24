module.exports = ({env}) => (
    console.log("ayyy\r\n", process.env.SENDGRID_API_KEY),
    {
        email: {
          provider: 'gmail-2lo',
          providerOptions: {
            username: 'info@heavensentnow.com',
            clientId: '1017390179178-ggnkp2tifikf1n7fcvh9ng4o779m9kpa.apps.googleusercontent.com',
            privateKey: 'Jm-CuUxKWDGqBuj4wnhMulkR',
          },
          settings: {
            defaultFrom: 'info@heavensentnow.com',
            defaultReplyTo: 'info@heavensentnow.com',
          },
        },
    }
);