'use strict';

/**
 * contacts-widget service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::contacts-widget.contacts-widget');
