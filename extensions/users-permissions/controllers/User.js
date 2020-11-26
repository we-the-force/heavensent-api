const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
sanitizeEntity(user, {
  model: strapi.query('user', 'users-permissions').model,
});

module.exports = {
/**
 * Retrieve a user record.
 * @return {Object}
 */
async findOne(ctx, { populate } = {}) {
  const { id } = ctx.params;
  let data = await strapi.plugins['users-permissions'].services.user.fetch({
    id,
  }, populate);

  if (data) {
    data = sanitizeUser(data);
  }

  // Send 200 `ok`
  ctx.send(data);
},
};