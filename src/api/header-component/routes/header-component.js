'use strict';

/**
 * header-component router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::header-component.header-component');
