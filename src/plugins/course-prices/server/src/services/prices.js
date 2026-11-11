'use strict';

const COURSE_UID = 'api::course.course';
const DIRECTION_UID = 'api::direction.direction';

function parsePrice(value, label) {
  if (value == null || value === '') return null;
  if (typeof value === 'number' && Number.isInteger(value) && value >= 0) return value;

  const text = String(value).trim();
  if (!/^\d+$/.test(text)) {
    throw new Error(`${label} должна быть целым числом от 0`);
  }

  return Number(text);
}

async function writePrices(strapi, documentId, prices) {
  const data = {
    default_price: prices.default_price,
    old_price_rub: prices.old_price_rub,
  };

  await strapi.documents(COURSE_UID).update({
    documentId,
    data,
    status: 'published',
  });

  await strapi.documents(COURSE_UID).update({
    documentId,
    data,
    status: 'draft',
  });
}

async function coursesOfDirection(strapi, directionDocumentId) {
  const pageSize = 100;
  let start = 0;
  const all = [];

  while (true) {
    const items = await strapi.documents(COURSE_UID).findMany({
      filters: {
        direction: {
          documentId: { $eq: directionDocumentId },
        },
      },
      fields: ['title', 'default_price', 'old_price_rub'],
      sort: 'title:asc',
      status: 'published',
      start,
      limit: pageSize,
    });

    const list = items || [];
    all.push(...list);
    if (list.length < pageSize) break;
    start += pageSize;
  }

  return all;
}

module.exports = ({ strapi }) => ({
  async listDirections() {
    const items = await strapi.documents(DIRECTION_UID).findMany({
      fields: ['title', 'slug'],
      sort: 'title:asc',
      status: 'published',
      limit: 100,
    });

    return (items || []).map((item) => ({
      documentId: item.documentId,
      title: item.title,
      slug: item.slug,
    }));
  },

  async listCourses(directionDocumentId) {
    const items = await coursesOfDirection(strapi, directionDocumentId);

    return items.map((item) => ({
      documentId: item.documentId,
      title: item.title || '',
      default_price: item.default_price ?? null,
      old_price_rub: item.old_price_rub ?? null,
    }));
  },

  async saveChanges(updates) {
    if (!Array.isArray(updates) || !updates.length) {
      return { updated: 0 };
    }

    let updated = 0;

    for (const item of updates) {
      if (!item?.documentId) {
        throw new Error('Не указан курс');
      }

      await writePrices(strapi, item.documentId, {
        default_price: parsePrice(item.default_price, 'Новая цена'),
        old_price_rub: parsePrice(item.old_price_rub, 'Старая цена'),
      });
      updated += 1;
    }

    return { updated };
  },

  async applyToDirection({ directionDocumentId, default_price, old_price_rub }) {
    if (!directionDocumentId) {
      throw new Error('Не выбрано направление');
    }

    const prices = {
      default_price: parsePrice(default_price, 'Новая цена'),
      old_price_rub: parsePrice(old_price_rub, 'Старая цена'),
    };

    if (prices.default_price == null || prices.old_price_rub == null) {
      throw new Error('Укажите старую и новую цену');
    }

    const courses = await coursesOfDirection(strapi, directionDocumentId);

    for (const course of courses) {
      await writePrices(strapi, course.documentId, prices);
    }

    return { updated: courses.length };
  },
});
