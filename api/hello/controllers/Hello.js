module.exports = {
    // GET /hello
    async index(ctx) {
        ctx.send(strapi.plugins["email"]);
    },
  };