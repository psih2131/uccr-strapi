'use strict';

async function run(ctx, action) {
  try {
    ctx.body = { data: await action() };
  } catch (error) {
    ctx.badRequest(error?.message || 'Не удалось обновить цены');
  }
}

module.exports = {
  async directions(ctx) {
    const data = await strapi.plugin('course-prices').service('prices').listDirections();
    ctx.body = { data };
  },

  async courses(ctx) {
    const directionDocumentId = ctx.query?.directionDocumentId;
    if (!directionDocumentId) {
      return ctx.badRequest('Не выбрано направление');
    }

    await run(ctx, () => strapi.plugin('course-prices').service('prices').listCourses(directionDocumentId));
  },

  async save(ctx) {
    const updates = ctx.request.body?.updates;
    await run(ctx, () => strapi.plugin('course-prices').service('prices').saveChanges(updates));
  },

  async apply(ctx) {
    const { directionDocumentId, default_price, old_price_rub } = ctx.request.body || {};
    await run(ctx, () => strapi.plugin('course-prices').service('prices').applyToDirection({
      directionDocumentId,
      default_price,
      old_price_rub,
    }));
  },
};
