import { getTranslation } from './utils/getTranslation';
import PluginIcon from './components/PluginIcon';

export default {
  register(app) {
    app.addMenuLink({
      to: 'plugins/course-prices',
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('plugin.name'),
        defaultMessage: 'Цены курсов',
      },
      Component: () => import('./pages/App'),
      permissions: [],
      position: 6,
    });

    app.registerPlugin({
      id: 'course-prices',
      name: 'Course prices',
    });
  },

  bootstrap() {},

  async registerTrads({ locales }) {
    return Promise.all(
      locales.map(async (locale) => {
        try {
          const { default: data } = await import(`./translations/${locale}.json`);
          return { data, locale };
        } catch {
          return { data: {}, locale };
        }
      }),
    );
  },
};
