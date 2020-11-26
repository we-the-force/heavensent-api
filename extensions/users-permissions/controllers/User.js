// const { sanitizeEntity } = require('strapi-utils');

// const sanitizeUser = user =>
//   sanitizeEntity(user, {
//     model: strapi.query('user', 'users-permissions').model,
//   });

// module.exports = {
//   async findOne(ctx) {
//     // const user = ctx.state.user;
//     const { id } = ctx.params;

//     if (!user) {
//       return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
//     }

//     const userQuery = await strapi.query('user', 'users-permissions');
//     const userWithMedia = await userQuery.findOne({ id: id });

//     const data = sanitizeUser(userWithMedia, { model: userQuery.model });
//     ctx.send(data);
//   },
// };

const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve a record.
   *
   * @return {Object}
   */

  async findOne(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.services.user.findOne({ id });
    return sanitizeEntity(entity, { model: strapi.models.user });
  },
};