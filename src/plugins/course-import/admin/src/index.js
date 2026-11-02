import { getTranslation } from './utils/getTranslation';
import PluginIcon from './components/PluginIcon';

export default {
  register(app) {
    app.addMenuLink({
      to: 'plugins/course-import',
      icon: PluginIcon,
      intlLabel: {
        id: getTranslation('plugin.name'),
        defaultMessage: 'Импорт курсов',
      },
      Component: () => import('./pages/App'),
      permissions: [],
      position: 4,
    });

    app.registerPlugin({
      id: 'course-import',
      name: 'Course Import',
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
