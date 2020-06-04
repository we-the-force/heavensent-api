'use strict';

/**
* Read the documentation (https://strapi.io/documentation/3.0.0-beta.x/concepts/controllers.html#core-controllers)
* to customize this controller
*/
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');

module.exports = {
   async create(ctx) {
      let entity;
      // console.log("On create");
      if (ctx.is('multipart')){
         // console.log("It's multipart");
         // console.log("parsing multidata");
         const {data, files} = parseMultipartData(ctx);
         // console.log("creating contact");
         entity = await strapi.services.contact.create(data, {files });
      }
      else
      {
         // console.log("It's not multipart");
         // console.log("creating contact");
         entity = await strapi.services.contact.create(ctx.request.body);
      }
      // console.log("Before sanitizing");
      let entry = sanitizeEntity(entity, {model: strapi.models.contact});
      // console.log("After sanitizing");
      // console.log(entry);
      
      await strapi.plugins['email'].services.email.send({
         to: `erfamel@gmail.com`,
         from: 'about@wetheforce.com',
         subject: 'Test',
         text: 'Juites invitado como admin vato',
         html: `Ira mensaje de admin vato aaah `
      });
      
      return entry;
   },
};