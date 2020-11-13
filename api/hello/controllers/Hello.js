module.exports = {
    // GET /hello
    async index(ctx) {
        // console.log(strapi.plugins["email"].services.email.getProviderConfig());
        // strapi.plugins["email"].services.email.send({
        //     to: 'erfamel@gmail.com',
        //     from: 'will@wetheforce.com',
        //     subject: 'Que rosho carnal',
        //     text: 'que rosho carnal text',
        //     html: "Esto es un html, como andas man"
        // });
        ctx.send("Sis");
    },
  };