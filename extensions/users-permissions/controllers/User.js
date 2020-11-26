const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

module.exports = {
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }

    const userQuery = await strapi.query('user', 'users-permissions');
    const userWithMedia = userQuery.findOne({ id: ctx.state.user.id }, ['mediaField']);

    const data = sanitizeUser(userWithMedia, { model: userQuery.model });
    ctx.send(data);
  },
};