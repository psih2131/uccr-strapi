'use strict';

const COURSE_UID = 'api::course.course';
const DIRECTION_UID = 'api::direction.direction';

function isEmptyAiData(aiData) {
  if (aiData == null) return true;
  if (typeof aiData !== 'object') return true;
  return Object.keys(aiData).length === 0;
}

function parsePrice(value) {
  if (value == null || value === '') return null;
  if (typeof value === 'number' && Number.isFinite(value)) return Math.round(value);

  const digits = String(value).replace(/[^\d]/g, '');
  if (!digits) return null;

  const parsed = Number(digits);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePosts(payload) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.posts)) return payload.posts;
  if (payload && typeof payload === 'object') return [payload];
  return [];
}

function mapFaq(aiData) {
  const items = aiData?.faq?.value;
  if (!Array.isArray(items) || !items.length) return [];

  return items
    .map((item) => ({
      questions: item?.question || null,
      answer: item?.answer || null,
    }))
    .filter((item) => item.questions);
}

function mapSeo(aiData) {
  const seo = aiData?.seo?.value;
  if (!seo || typeof seo !== 'object') return null;

  return {
    title: seo.title || null,
    meta_description: seo.meta_description || null,
    keywords: seo.keywords || null,
    og_type: seo.og_type || null,
    og_title: seo.og_title || null,
    og_description: seo.og_description || null,
  };
}

function mapPriceSecV2(aiData) {
  const items = aiData?.price_variants?.value;
  if (!Array.isArray(items) || !items.length) return null;

  const price_list = items
    .map((item) => ({
      title: item?.title || null,
      subtitle: item?.level || null,
      hour: item?.duration || null,
      type: item?.format || null,
      current_price: parsePrice(item?.current_price),
      old_price: parsePrice(item?.old_price),
    }))
    .filter((item) => item.title);

  if (!price_list.length) return null;

  return {
    title_section: 'Стоимость обучения и тарифы',
    price_list,
  };
}

function mapWhatWaitingFor(aiData) {
  const items = aiData?.what_waiting_for?.value;
  if (!Array.isArray(items) || !items.length) return [];

  return items
    .map((item) => ({
      title: item?.title || null,
      text: item?.text || null,
      time: item?.time || null,
    }))
    .filter((item) => item.title);
}

function mapForWhoSection(aiData) {
  const items = aiData?.for_who?.value;
  if (!Array.isArray(items) || !items.length) return null;

  const for_who_items = items
    .map((item) => ({
      title: item?.title || null,
    }))
    .filter((item) => item.title);

  if (!for_who_items.length) return null;

  return {
    section_title: 'Для кого этот курс подходит',
    for_who_items,
  };
}

function mapRecommendedCourses(aiData) {
  const items = aiData?.recommend?.value;
  if (!Array.isArray(items) || !items.length) return [];

  return items
    .map((item) => ({
      slug: item?.slug || null,
    }))
    .filter((item) => item.slug);
}

function mapCourseData(post, directionDocumentId) {
  const aiData = post.ai_data;
  const slug = aiData?.seo?.value?.slug;
  const title = aiData?.title?.value || post.title || null;
  const priceValue = aiData?.price?.value || {};

  if (!slug || !title) {
    return null;
  }

  return {
    slug,
    title,
    H1_title: title,
    time: aiData?.training?.value?.duration || null,
    old_price_rub: parsePrice(priceValue.old_price ?? priceValue.old_price_rub),
    default_price: parsePrice(priceValue.current_price ?? priceValue.default_price),
    faq_section: mapFaq(aiData),
    Seo: mapSeo(aiData),
    price_sec_v2: mapPriceSecV2(aiData),
    what_waiting_for_section: mapWhatWaitingFor(aiData),
    for_who_section: mapForWhoSection(aiData),
    recommended_courses_item: mapRecommendedCourses(aiData),
    seo_text_section: aiData?.seo_text?.value || null,
    seo_text_down: aiData?.footer_text?.value || null,
    direction: {
      connect: [directionDocumentId],
    },
  };
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

  async importCourses({ directionDocumentId, posts }) {
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

    const list = normalizePosts(posts);
    const result = {
      total: list.length,
      skipped: 0,
      created: 0,
      updated: 0,
      errors: [],
    };

    for (const post of list) {
      try {
        if (isEmptyAiData(post?.ai_data)) {
          result.skipped += 1;
          continue;
        }

        const data = mapCourseData(post, directionDocumentId);
        if (!data) {
          result.skipped += 1;
          continue;
        }

        const existing = await strapi.documents(COURSE_UID).findMany({
          filters: { slug: { $eq: data.slug } },
          fields: ['slug'],
          limit: 1,
          status: 'draft',
        });

        const found = existing?.[0];

        if (found?.documentId) {
          await strapi.documents(COURSE_UID).update({
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
          await strapi.documents(COURSE_UID).create({
            data,
            status: 'published',
          });
          result.created += 1;
        }
      } catch (error) {
        const details = error?.details?.errors;
        const detailMsg = Array.isArray(details)
          ? details.map((item) => item?.message || item?.path?.join('.') || String(item)).join('; ')
          : null;

        result.errors.push({
          id: post?.id || null,
          slug: post?.ai_data?.seo?.value?.slug || null,
          message: detailMsg || error?.message || String(error),
        });
      }
    }

    return result;
  },
});
