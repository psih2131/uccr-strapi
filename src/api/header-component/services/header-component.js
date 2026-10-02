'use strict';

/**
 * header-component service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::header-component.header-component');
