'use strict';

const CATEGORY_UID = 'api::category-direction.category-direction';
const DIRECTION_UID = 'api::direction.direction';

function normalizeCategories(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.categories)) return payload.categories;
  if (Array.isArray(payload?.professions)) return payload.professions;
  return [];
}

function withDirectionSlug(slug, directionSlug) {
  const suffix = String(directionSlug || '').trim();
  if (!suffix) return slug;
  if (slug === suffix || slug.endsWith(`-${suffix}`)) return slug;
  return `${slug}-${suffix}`;
}

function mapCategory(item, direction) {
  const title = typeof item?.name === 'string' ? item.name.trim() : '';
  const slug = typeof item?.slug === 'string' ? item.slug.trim() : '';
  const catId = item?.id_cat;

  if (!title || !slug || catId == null || catId === '') return null;

  const cat_id = String(catId).trim();
  if (!/^\d+$/.test(cat_id)) return null;

  return {
    title,
    slug: withDirectionSlug(slug, direction.slug),
    cat_id,
    direction: {
      connect: [direction.documentId],
    },
  };
}

function errorMessage(error) {
  const details = error?.details?.errors;
  if (Array.isArray(details) && details.length) {
    return details.map((item) => item?.message || item?.path?.join('.') || String(item)).join('; ');
  }
  return error?.message || String(error);
}

module.exports = ({ strapi }) => ({
  async listDirections() {
    const items = await strapi.documents(DIRECTION_UID).findMany({
      fields: ['title', 'slug'],
      sort: 'title:asc',
      status: 'draft',
      limit: 200,
    });

    return (items || []).map((item) => ({
      documentId: item.documentId,
      title: item.title,
      slug: item.slug,
    }));
  },

  async importCategories({ directionDocumentId, categories }) {
    if (!directionDocumentId) {
      throw new Error('Не выбрано направление');
    }

    const direction = await strapi.documents(DIRECTION_UID).findOne({
      documentId: directionDocumentId,
      fields: ['title', 'slug'],
    });

    if (!direction) {
      throw new Error('Направление не найдено');
    }

    if (!direction.slug) {
      throw new Error('У выбранного направления нет slug');
    }

    direction.documentId = direction.documentId || directionDocumentId;

    const list = normalizeCategories(categories);
    const result = {
      total: list.length,
      created: 0,
      updated: 0,
      errors: [],
    };

    for (const item of list) {
      const data = mapCategory(item, direction);
      if (!data) {
        result.errors.push({
          cat_id: item?.id_cat ?? null,
          slug: item?.slug || null,
          message: 'Нужны id_cat, name и slug',
        });
        continue;
      }

      try {
        const byCatId = await strapi.documents(CATEGORY_UID).findMany({
          filters: { cat_id: { $eq: data.cat_id } },
          fields: ['cat_id', 'slug'],
          limit: 1,
          status: 'draft',
        });

        const found = byCatId?.[0];

        if (!found?.documentId) {
          const bySlug = await strapi.documents(CATEGORY_UID).findMany({
            filters: { slug: { $eq: data.slug } },
            fields: ['slug', 'cat_id'],
            limit: 1,
            status: 'draft',
          });
          const slugOwner = bySlug?.[0];

          if (slugOwner?.documentId && String(slugOwner.cat_id) !== data.cat_id) {
            result.errors.push({
              cat_id: data.cat_id,
              slug: data.slug,
              message: `slug уже занят категорией ${slugOwner.cat_id || slugOwner.documentId}`,
            });
            continue;
          }
        }

        if (found?.documentId) {
          await strapi.documents(CATEGORY_UID).update({
            documentId: found.documentId,
            data: {
              ...data,
              direction: {
                set: [directionDocumentId],
              },
            },
            status: 'published',
          });
          result.updated += 1;
        } else {
          await strapi.documents(CATEGORY_UID).create({
            data,
            status: 'published',
          });
          result.created += 1;
        }
      } catch (error) {
        result.errors.push({
          cat_id: data.cat_id,
          slug: data.slug,
          message: errorMessage(error),
        });
      }
    }

    return result;
  },
});
