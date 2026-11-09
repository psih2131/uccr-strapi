module.exports = [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      jsonLimit: '1gb',
      formLimit: '1gb',
      textLimit: '1gb',
    },
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
