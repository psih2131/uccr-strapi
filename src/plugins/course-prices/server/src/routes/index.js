'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/directions',
        handler: 'prices.directions',
        config: {
          policies: [],
        },
      },
      {
        method: 'GET',
        path: '/courses',
        handler: 'prices.courses',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/save',
        handler: 'prices.save',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/apply',
        handler: 'prices.apply',
        config: {
          policies: [],
        },
      },
    ],
  },
};
