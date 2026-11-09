'use strict';

module.exports = {
  admin: {
    type: 'admin',
    routes: [
      {
        method: 'GET',
        path: '/directions',
        handler: 'import.directions',
        config: {
          policies: [],
        },
      },
      {
        method: 'POST',
        path: '/run',
        handler: 'import.run',
        config: {
          policies: [],
        },
      },
    ],
  },
};
