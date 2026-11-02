'use strict';

module.exports = {
  async directions(ctx) {
    const data = await strapi.plugin('course-import').service('import').listDirections();
    ctx.body = { data };
  },

  async run(ctx) {
    const { directionDocumentId, posts } = ctx.request.body || {};

    const data = await strapi
      .plugin('course-import')
      .service('import')
      .importCourses({ directionDocumentId, posts });

    ctx.body = { data };
  },
};
