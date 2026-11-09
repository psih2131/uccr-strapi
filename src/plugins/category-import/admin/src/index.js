import { getTranslation } from './utils/getTranslation';
import PluginIcon from './components/PluginIcon';

export default {
  register(app) {
    app.addMenuLink({
      to: 'plugins/category-import',
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('plugin.name'),
        defaultMessage: 'Импорт категорий',
      },
      Component: () => import('./pages/App'),
      permissions: [],
      position: 5,
    });

    app.registerPlugin({
      id: 'category-import',
      name: 'Category Import',
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
