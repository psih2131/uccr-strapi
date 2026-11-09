'use strict';

module.exports = {
  async directions(ctx) {
    const data = await strapi.plugin('category-import').service('import').listDirections();
    ctx.body = { data };
  },

  async run(ctx) {
    const { directionDocumentId, categories } = ctx.request.body || {};

    const data = await strapi
      .plugin('category-import')
      .service('import')
      .importCategories({ directionDocumentId, categories });

    ctx.body = { data };
  },
};
